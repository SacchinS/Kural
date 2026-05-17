import type { NextRequest } from 'next/server';
import { getPatientProfile, savePatientProfile } from '@/lib/dynamodb';
import { getUserIdFromBearer } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  const userId = getUserIdFromBearer(request.headers.get('authorization'));
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const profile = await getPatientProfile(userId);
    return Response.json(profile ?? {});
  } catch (err) {
    console.error('[profile GET]', err);
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const userId = getUserIdFromBearer(request.headers.get('authorization'));
  console.log('[profile PUT] userId (Cognito sub):', userId ?? 'MISSING');
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const tableName = process.env.KURAL_PATIENT_TABLE ?? '(KURAL_PATIENT_TABLE not set)';
  console.log('[profile PUT] DynamoDB table:', tableName);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    console.log('[profile PUT] payload:', JSON.stringify(body));
    await savePatientProfile(userId, body);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('[profile PUT] DynamoDB error:', err);
    const message = err instanceof Error ? err.message : String(err);
    const detail = process.env.NODE_ENV === 'development' ? message : 'Failed to save profile';
    return Response.json({ error: detail }, { status: 500 });
  }
}
