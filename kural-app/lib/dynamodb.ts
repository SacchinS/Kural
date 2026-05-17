import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const dynamo = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' }),
);

function table(): string {
  const t = process.env.KURAL_PATIENT_TABLE;
  if (!t) throw new Error('KURAL_PATIENT_TABLE env var is not set');
  return t;
}

export interface PatientProfile {
  patient_id: string;
  name?: string;
  email?: string;
  voice_style?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// kural-patients — partition key: patient_id (Cognito sub)
export async function getPatientProfile(patientId: string): Promise<PatientProfile | null> {
  const result = await dynamo.send(
    new GetCommand({ TableName: table(), Key: { patient_id: patientId } }),
  );
  return (result.Item as PatientProfile) ?? null;
}

export async function savePatientProfile(
  patientId: string,
  profile: Omit<PatientProfile, 'patient_id'>,
): Promise<void> {
  await dynamo.send(
    new PutCommand({
      TableName: table(),
      Item: { ...profile, patient_id: patientId, updated_at: new Date().toISOString() },
    }),
  );
}
