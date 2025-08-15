import os, json, time, traceback
from datetime import datetime
from azure.servicebus import ServiceBusClient
from azure.storage.blob import BlobServiceClient
from openai import AzureOpenAI

# environment variables
SB_CONN   = os.environ["SERVICEBUS_CONNECTION_STRING"]
SB_QUEUE  = os.environ.get("SERVICEBUS_QUEUE", "simiriki-jobs")
SA_NAME   = os.environ["STORAGE_ACCOUNT_NAME"]
SA_KEY    = os.environ["STORAGE_ACCOUNT_KEY"]
CONTAINER = os.environ.get("STORAGE_CONTAINER", "jobs")

AZ_OAI_ENDPOINT = os.environ["AZURE_OPENAI_ENDPOINT"]
AZ_OAI_KEY      = os.environ["AZURE_OPENAI_KEY"]
AZ_OAI_DEPLOY   = os.environ["AZURE_OPENAI_DEPLOYMENT"]
AZ_OAI_API_VER  = os.environ.get("AZURE_OPENAI_API_VERSION","2024-10-21")

client = AzureOpenAI(api_key=AZ_OAI_KEY, api_version=AZ_OAI_API_VER, azure_endpoint=AZ_OAI_ENDPOINT)

def blob_client():
    conn = f"DefaultEndpointsProtocol=https;AccountName={SA_NAME};AccountKey={SA_KEY};EndpointSuffix=core.windows.net"
    return BlobServiceClient.from_connection_string(conn)

def update_status(job_id, **fields):
    bsc = blob_client()
    cont = bsc.get_container_client(CONTAINER)
    blob = cont.get_blob_client(f"{job_id}.json")
    try:
        current = {}
        if blob.exists():
            current = json.loads(blob.download_blob().readall().decode("utf-8"))
        current.update(fields)
        current.setdefault("updatedAt", datetime.utcnow().isoformat())
        blob.upload_blob(json.dumps(current), overwrite=True)
    except Exception as e:
        print("Status update failed:", e)

def process_message(msg_body: dict, job_id: str):
    job_type = (msg_body.get("type") or "generic").lower()
    payload  = msg_body.get("data") or {}
    if job_type in ["long_summary","summary","summarize"]:
        text = payload.get("text","")
        resp = client.chat.completions.create(
            model=AZ_OAI_DEPLOY,
            messages=[
                {"role":"system","content":"You are a precise summarizer."},
                {"role":"user","content": f"Summarize concisely:\n\n{text}"}
            ],
            temperature=0.2
        )
        return {"resultType":"summary","summary": resp.choices[0].message.content}
    elif job_type in ["embed_batch","embeddings"]:
        items = payload.get("items",[])
        return {"resultType":"embeddings","count": len(items)}
    elif job_type in ["pdf_render"]:
        return {"resultType":"pdf_render","url":"blob://path/to/rendered.pdf"}
    else:
        return {"resultType":"noop","echo": payload}

def main():
    sb = ServiceBusClient.from_connection_string(SB_CONN)
    receiver = sb.get_queue_receiver(queue_name=SB_QUEUE, max_wait_time=5)
    print("Worker started. Listening for jobs...")
    while True:
        with receiver:
            for msg in receiver:
                job_id = (msg.application_properties or {}).get(b"jobId", b"").decode("utf-8")
                job_type = (msg.application_properties or {}).get(b"type", b"").decode("utf-8")
                try:
                    update_status(job_id, status="running", startedAt=datetime.utcnow().isoformat(), jobType=job_type)
                    body = msg.body
                    if isinstance(body, (bytes, bytearray)):
                        body = json.loads(body.decode("utf-8"))
                    result = process_message(body, job_id)
                    update_status(job_id, status="succeeded", completedAt=datetime.utcnow().isoformat(), result=result)
                    receiver.complete_message(msg)
                except Exception as e:
                    traceback.print_exc()
                    update_status(job_id, status="failed", error=str(e), failedAt=datetime.utcnow().isoformat())
                    receiver.abandon_message(msg)
        time.sleep(1)

if __name__ == "__main__":
    main()
