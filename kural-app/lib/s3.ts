import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.AWS_REGION ?? 'us-east-1' });

function bucket(): string {
  const b = process.env.KURAL_PATIENT_BUCKET;
  if (!b) throw new Error('KURAL_PATIENT_BUCKET env var is not set');
  return b;
}

// patients/{patientId}/voice/{filename}
export async function uploadVoiceSample(
  patientId: string,
  filename: string,
  body: Buffer,
  contentType = 'audio/webm',
): Promise<string> {
  const key = `patients/${patientId}/voice/${filename}`;
  await s3.send(
    new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: contentType }),
  );
  return key;
}

// patients/{patientId}/voice/
export async function listVoiceSamples(patientId: string): Promise<string[]> {
  const res = await s3.send(
    new ListObjectsV2Command({ Bucket: bucket(), Prefix: `patients/${patientId}/voice/` }),
  );
  return (res.Contents ?? []).map((o) => o.Key ?? '').filter(Boolean);
}
