import { OFFLINE_FALLBACK, ERROR_FALLBACK } from './tiles';

const API_URL = 'https://srcutqfjs1.execute-api.us-west-2.amazonaws.com/prod/generate';
const TIMEOUT_MS = 20000;

function timeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

async function post(body: object): Promise<Response> {
  const signal = typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(TIMEOUT_MS)
    : timeoutSignal(TIMEOUT_MS);
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
}

function getOfflineFallback(intentPath: string): string[] {
  for (const key of Object.keys(OFFLINE_FALLBACK)) {
    if (intentPath.startsWith(key)) return OFFLINE_FALLBACK[key];
  }
  return ERROR_FALLBACK;
}

export async function generateSentences(intentPath: string, patientId: string, sessionId: string): Promise<{ sentences: string[]; offline: boolean }> {
  try {
    const res = await post({ action: 'generate', patient_id: patientId, session_id: sessionId, intent_path: intentPath });
    const data = await res.json();
    if (data.errorMessage || data.errorType) {
      console.error('[aac/generate] Lambda error:', data.errorType, data.errorMessage, '\n', data.stackTrace?.join('\n'));
      return { sentences: getOfflineFallback(intentPath), offline: true };
    }
    const sentences = JSON.parse(data.body).sentences as string[];
    return { sentences, offline: false };
  } catch (err) {
    console.error('[aac/generate] fetch/parse error:', err);
    return { sentences: getOfflineFallback(intentPath), offline: true };
  }
}

export async function regenerateSentences(
  intentPath: string,
  nudge: string,
  previousOptions: string[],
  patientId: string,
  sessionId: string,
): Promise<{ sentences: string[]; offline: boolean }> {
  try {
    const res = await post({
      action: 'regenerate',
      patient_id: patientId,
      session_id: sessionId,
      intent_path: intentPath,
      nudge,
      previous_options: previousOptions,
    });
    const data = await res.json();
    if (data.errorMessage || data.errorType) {
      console.error('[aac/regenerate] Lambda error:', data.errorType, data.errorMessage, '\n', data.stackTrace?.join('\n'));
      return { sentences: getOfflineFallback(intentPath), offline: true };
    }
    const sentences = JSON.parse(data.body).sentences as string[];
    return { sentences, offline: false };
  } catch (err) {
    console.error('[aac/regenerate] fetch/parse error:', err);
    return { sentences: getOfflineFallback(intentPath), offline: true };
  }
}

export async function logSelection(
  intentPath: string,
  optionsShown: string[],
  selectedIndex: number,
  patientId: string,
  sessionId: string,
): Promise<void> {
  try {
    await post({
      action: 'log_selection',
      patient_id: patientId,
      session_id: sessionId,
      intent_path: intentPath,
      options_shown: optionsShown,
      selected_index: selectedIndex,
    });
  } catch {
    // fire-and-forget, non-critical
  }
}

export async function appendExchange(
  text: string,
  patientId: string,
  sessionId: string,
  speaker: 'patient' | 'caregiver' = 'patient',
): Promise<void> {
  try {
    await post({
      action: 'append_exchange',
      patient_id: patientId,
      session_id: sessionId,
      speaker,
      text,
    });
  } catch {
    // fire-and-forget, non-critical
  }
}

export async function synthesizeAsync(text: string, patientId: string): Promise<{ jobId: string } | null> {
  try {
    const res = await post({ action: 'synthesize_async', patient_id: patientId, text });
    const data = await res.json();
    if (!res.ok || data.errorMessage || data.errorType) {
      console.error('[aac/synthesize] Lambda error:', res.status, data.errorType, data.errorMessage);
      return null;
    }
    const body = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
    if (!body?.job_id) {
      console.error('[aac/synthesize] Missing job_id:', data);
      return null;
    }
    return { jobId: body.job_id };
  } catch (err) {
    console.error('[aac/synthesize] fetch/parse error:', err);
    return null;
  }
}

export async function checkAudio(jobId: string): Promise<{ status: string; audioUrl?: string }> {
  try {
    const res = await post({ action: 'check_audio', job_id: jobId });
    const data = await res.json();
    if (!res.ok || data.errorMessage || data.errorType) {
      console.error('[aac/check_audio] Lambda error:', res.status, data.errorType, data.errorMessage);
      return { status: 'failed' };
    }
    const body = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
    if (!body?.status) {
      console.error('[aac/check_audio] Missing status:', data);
      return { status: 'failed' };
    }
    return { status: body.status, audioUrl: body.audio_url };
  } catch (err) {
    console.error('[aac/check_audio] fetch/parse error:', err);
    return { status: 'failed' };
  }
}
