import { OFFLINE_FALLBACK, ERROR_FALLBACK } from './tiles';

const API_URL = 'https://srcutqfjs1.execute-api.us-west-2.amazonaws.com/prod/generate';
const PATIENT_ID = 'patient_001';
const SESSION_ID = 'demo-session-001';
const TIMEOUT_MS = 8000;

async function post(body: object): Promise<Response> {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

function getOfflineFallback(intentPath: string): string[] {
  for (const key of Object.keys(OFFLINE_FALLBACK)) {
    if (intentPath.startsWith(key)) return OFFLINE_FALLBACK[key];
  }
  return ERROR_FALLBACK;
}

export async function generateSentences(intentPath: string): Promise<{ sentences: string[]; offline: boolean }> {
  try {
    const res = await post({ action: 'generate', patient_id: PATIENT_ID, session_id: SESSION_ID, intent_path: intentPath });
    const data = await res.json();
    const sentences = JSON.parse(data.body).sentences as string[];
    return { sentences, offline: false };
  } catch {
    return { sentences: getOfflineFallback(intentPath), offline: true };
  }
}

export async function regenerateSentences(
  intentPath: string,
  nudge: string,
  previousOptions: string[],
): Promise<{ sentences: string[]; offline: boolean }> {
  try {
    const res = await post({
      action: 'regenerate',
      patient_id: PATIENT_ID,
      session_id: SESSION_ID,
      intent_path: intentPath,
      nudge,
      previous_options: previousOptions,
    });
    const data = await res.json();
    const sentences = JSON.parse(data.body).sentences as string[];
    return { sentences, offline: false };
  } catch {
    return { sentences: getOfflineFallback(intentPath), offline: true };
  }
}

export async function logSelection(
  intentPath: string,
  optionsShown: string[],
  selectedIndex: number,
): Promise<void> {
  try {
    await post({
      action: 'log_selection',
      patient_id: PATIENT_ID,
      session_id: SESSION_ID,
      intent_path: intentPath,
      options_shown: optionsShown,
      selected_index: selectedIndex,
    });
  } catch {
    // fire-and-forget, non-critical
  }
}

export async function appendExchange(text: string): Promise<void> {
  try {
    await post({
      action: 'append_exchange',
      patient_id: PATIENT_ID,
      session_id: SESSION_ID,
      speaker: 'robert',
      text,
    });
  } catch {
    // fire-and-forget, non-critical
  }
}
