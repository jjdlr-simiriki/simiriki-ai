import { NextRequest, NextResponse } from 'next/server';
import { ServiceBusClient } from '@azure/service-bus';
import { BlobServiceClient } from '@azure/storage-blob';
import { randomUUID } from 'crypto';

const sbConn = process.env.SERVICEBUS_CONNECTION_STRING!;
const sbQueue = process.env.SERVICEBUS_QUEUE!;
const saName = process.env.STORAGE_ACCOUNT_NAME!;
const saKey = process.env.STORAGE_ACCOUNT_KEY!;
const container = process.env.STORAGE_CONTAINER!;
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const sbConn = getEnvVar('SERVICEBUS_CONNECTION_STRING');
const sbQueue = getEnvVar('SERVICEBUS_QUEUE');
const saName = getEnvVar('STORAGE_ACCOUNT_NAME');
const saKey = getEnvVar('STORAGE_ACCOUNT_KEY');
const container = getEnvVar('STORAGE_CONTAINER');
function blobClient() {
  const conn = `DefaultEndpointsProtocol=https;AccountName=${saName};AccountKey=${saKey};EndpointSuffix=core.windows.net`;
  return BlobServiceClient.fromConnectionString(conn);
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json(); // { type, data, priority? }
    const jobId = randomUUID();

    const bsc = blobClient();
    const cont = bsc.getContainerClient(container);
    const blob = cont.getBlockBlobClient(`${jobId}.json`);
    const initial = {
      jobId,
      status: 'queued',
      createdAt: new Date().toISOString(),
      payloadMeta: { type: payload?.type ?? 'generic' }
    };
    const initStr = JSON.stringify(initial);
    await blob.upload(initStr, Buffer.byteLength(initStr));

    const sb = new ServiceBusClient(sbConn);
    const sender = sb.createSender(sbQueue);
    await sender.sendMessages({
      body: payload ?? {},
      applicationProperties: {
        jobId,
        type: payload?.type ?? 'generic',
        priority: payload?.priority ?? 0,
      }
    });
    await sender.close();
    await sb.close();

    return NextResponse.json({ jobId }, { status: 202 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'enqueue_failed', detail: err?.message }, { status: 500 });
  }
}
