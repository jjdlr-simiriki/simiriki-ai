import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';

const saName = process.env.STORAGE_ACCOUNT_NAME!;
const saKey = process.env.STORAGE_ACCOUNT_KEY!;
const container = process.env.STORAGE_CONTAINER!;
const saName = process.env.STORAGE_ACCOUNT_NAME;
const saKey = process.env.STORAGE_ACCOUNT_KEY;
const container = process.env.STORAGE_CONTAINER;

if (!saName || !saKey || !container) {
  throw new Error(
    'Missing required environment variables: ' +
    [
      !saName ? 'STORAGE_ACCOUNT_NAME' : null,
      !saKey ? 'STORAGE_ACCOUNT_KEY' : null,
      !container ? 'STORAGE_CONTAINER' : null
    ].filter(Boolean).join(', ')
  );
}
function blobClient() {
  const conn = `DefaultEndpointsProtocol=https;AccountName=${saName};AccountKey=${saKey};EndpointSuffix=core.windows.net`;
  return BlobServiceClient.fromConnectionString(conn);
}

export async function GET(_req: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const { jobId } = params;
    const bsc = blobClient();
    const cont = bsc.getContainerClient(container);
    const blob = cont.getBlockBlobClient(`${jobId}.json`);
    if (!(await blob.exists())) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    const downloaded = await blob.download();
    const text = await streamToString(downloaded.readableStreamBody!);
    const doc = JSON.parse(text);
    return NextResponse.json(doc);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'status_failed', detail: err?.message }, { status: 500 });
  }
}

async function streamToString(stream: NodeJS.ReadableStream) {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf-8');
}
