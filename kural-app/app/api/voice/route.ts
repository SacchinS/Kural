import type { NextRequest } from 'next/server';
import { listVoiceSamples, uploadVoiceSample } from '@/lib/s3';
import { getUserIdFromBearer } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  const userId = getUserIdFromBearer(request.headers.get('authorization'));
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const samples = await listVoiceSamples(userId);
    return Response.json({ samples });
  } catch (err) {
    console.error('[voice GET]', err);
    return Response.json({ error: 'Failed to list voice samples' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromBearer(request.headers.get('authorization'));
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = await uploadVoiceSample(userId, file.name, buffer, file.type || 'audio/webm');
    return Response.json({ key });
  } catch (err) {
    console.error('[voice POST]', err);
    return Response.json({ error: 'Failed to upload voice sample' }, { status: 500 });
  }
}
