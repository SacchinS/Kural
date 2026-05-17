'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AudioWaveform, MessageSquare } from 'lucide-react';
import Link from 'next/link';

import { configureAmplify } from '@/lib/amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { AACState, AACStateData, ConversationEntry } from '@/lib/aac/types';
import { TILE_HIERARCHY, NUDGE_OPTIONS } from '@/lib/aac/tiles';
import { generateSentences, regenerateSentences, logSelection, appendExchange, synthesizeAsync, checkAudio } from '@/lib/aac/api';

import Tile from './Tile';
import DwellButton from './DwellButton';
import BreadcrumbPath from './BreadcrumbPath';
import ConversationPanel from './ConversationPanel';
import KeyboardFallback from './KeyboardFallback';
import LoadingSpinner from './LoadingSpinner';

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.92;
  window.speechSynthesis.speak(utt);
}

export default function KuralAAC() {
  const [stateData, setStateData] = useState<AACStateData>({ state: 'L1' });
  const [history, setHistory] = useState<AACStateData[]>([]);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}`);
  const [patientId, setPatientId] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [speaking, setSpeaking] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const synthesisGen = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    configureAmplify();
    fetchAuthSession().then(async ({ tokens }) => {
      const idToken = tokens?.idToken;
      if (!idToken) { setAuthLoading(false); return; }
      const sub = (idToken.payload as Record<string, unknown>).sub as string;
      setPatientId(sub);
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${idToken.toString()}` },
      });
      if (res.ok) {
        const profile = await res.json() as { name?: string };
        if (profile.name) setPatientName(profile.name);
      }
    }).catch(() => {}).finally(() => setAuthLoading(false));
  }, []);

  // Always reflects latest stateData without stale closures in async callbacks
  const stateRef = useRef(stateData);
  stateRef.current = stateData;

  const pushState = useCallback((next: AACStateData) => {
    setHistory((h) => [...h, stateRef.current]);
    setStateData(next);
  }, []);

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      setStateData(h[h.length - 1]);
      return h.slice(0, -1);
    });
    setLoading(false);
  }, []);

  const resetToL1 = useCallback(() => {
    if (returnTimer.current) clearTimeout(returnTimer.current);
    returnTimer.current = setTimeout(() => {
      setHistory([]);
      setStateData({ state: 'L1' });
    }, 2500);
  }, []);

  const addEntry = useCallback((text: string, speaker: 'robert' | 'caregiver' = 'robert') => {
    setConversation((c) => [
      ...c,
      { id: `${Date.now()}-${Math.random()}`, speaker, text, timestamp: new Date() },
    ]);
  }, []);

  // ── L1 ──────────────────────────────────────────────────────────────────────
  const handleL1Select = useCallback((key: string) => {
    if (key === 'Yes / No') { pushState({ state: 'YESNO', l1Key: key }); return; }
    if (key === 'Quick phrase') { pushState({ state: 'QUICK', l1Key: key }); return; }
    pushState({ state: 'L2', l1Key: key });
  }, [pushState]);

  // ── L2 ──────────────────────────────────────────────────────────────────────
  const handleL2Select = useCallback(async (l1Key: string, l2Key: string) => {
    const l2Value = (TILE_HIERARCHY[l1Key] as Record<string, string[] | null>)[l2Key];
    if (l2Value !== null && l2Key !== 'Something else') {
      pushState({ state: 'L3', l1Key, l2Key });
      return;
    }
    // null or "Something else" → generate sentences; loading overlays current L2 view
    const intentPath = `${l1Key} → ${l2Key}`;
    setLoading(true);
    const { sentences, offline: isOffline } = await generateSentences(intentPath, patientId, sessionId);
    setOffline(isOffline);
    setLoading(false);
    pushState({ state: 'SENTENCES', l1Key, l2Key, intentPath, sentences });
  }, [pushState, patientId, sessionId]);

  // ── L3 ──────────────────────────────────────────────────────────────────────
  const handleL3Select = useCallback(async (l1Key: string, l2Key: string, l3Key: string) => {
    const intentPath = `${l1Key} → ${l2Key} → ${l3Key}`;
    setLoading(true);
    const { sentences, offline: isOffline } = await generateSentences(intentPath, patientId, sessionId);
    setOffline(isOffline);
    setLoading(false);
    pushState({ state: 'SENTENCES', l1Key, l2Key, l3Key: l3Key, intentPath, sentences });
  }, [pushState, patientId, sessionId]);

  // ── SENTENCES ────────────────────────────────────────────────────────────────
  const handleSentenceSelect = useCallback((sentence: string, index: number) => {
    const { intentPath, sentences } = stateRef.current;

    logSelection(intentPath ?? '', sentences ?? [], index, patientId, sessionId);
    appendExchange(sentence, patientId, sessionId);
    addEntry(sentence, 'robert');
    setHistory([]);
    setStateData({ state: 'L1' });
    resetToL1();

    const gen = ++synthesisGen.current;
    setSpeaking(true);

    const fallbackTTS = () => {
      if (synthesisGen.current !== gen) return;
      setSpeaking(false);
      speak(sentence);
    };

    const POLL_INTERVAL_MS = 2000;
    const POLL_TIMEOUT_MS = 2 * 60 * 1000;
    const startTime = Date.now();

    synthesizeAsync(sentence, patientId).then((result) => {
      if (synthesisGen.current !== gen) return;
      if (!result) { fallbackTTS(); return; }

      const { jobId } = result;
      const poll = () => {
        if (synthesisGen.current !== gen) return;
        if (Date.now() - startTime > POLL_TIMEOUT_MS) { fallbackTTS(); return; }
        checkAudio(jobId).then(({ status, audioUrl }) => {
          if (synthesisGen.current !== gen) return;
          if (status === 'complete' && audioUrl) {
            setSpeaking(false);
            new Audio(audioUrl).play().catch(fallbackTTS);
          } else if (status === 'failed') {
            fallbackTTS();
          } else {
            setTimeout(poll, POLL_INTERVAL_MS);
          }
        });
      };
      setTimeout(poll, POLL_INTERVAL_MS);
    }).catch(fallbackTTS);
  }, [addEntry, resetToL1, patientId, sessionId]);

  // ── NUDGE ────────────────────────────────────────────────────────────────────
  const handleNudge = useCallback(async (nudge: string) => {
    const current = stateRef.current;
    if (nudge === 'Manual input') {
      pushState({ ...current, state: 'KEYBOARD' });
      return;
    }
    setLoading(true);
    const { sentences: newSentences, offline: isOffline } = await regenerateSentences(
      current.intentPath ?? '',
      nudge,
      current.sentences ?? [],
      patientId,
      sessionId,
    );
    setOffline(isOffline);
    setLoading(false);
    pushState({ ...current, state: 'SENTENCES', sentences: newSentences, previousOptions: current.sentences });
  }, [pushState, patientId, sessionId]);

  // ── YESNO / QUICK ────────────────────────────────────────────────────────────
  const handleInstantSpeak = useCallback((phrase: string) => {
    speak(phrase);
    addEntry(phrase, 'robert');
    setHistory([]);
    setStateData({ state: 'L1' });
    resetToL1();
  }, [addEntry, resetToL1]);

  // ── KEYBOARD ─────────────────────────────────────────────────────────────────
  const handleKeyboardSpeak = useCallback((text: string) => {
    speak(text);
    addEntry(text, 'robert');
    appendExchange(text, patientId, sessionId);
    setHistory([]);
    setStateData({ state: 'L1' });
    resetToL1();
  }, [addEntry, resetToL1, patientId, sessionId]);

  // ── Caregiver ────────────────────────────────────────────────────────────────
  const handleCaregiverSend = useCallback((text: string) => {
    addEntry(text, 'caregiver');
    appendExchange(text, patientId, sessionId, 'caregiver');
  }, [addEntry, patientId, sessionId]);

  const clearConversation = useCallback(() => {
    setConversation([]);
    setSessionId(`session-${Date.now()}`);
  }, []);

  // ── Render tiles ─────────────────────────────────────────────────────────────
  const { state, l1Key, l2Key, intentPath, sentences } = stateData;

  const breadcrumb: string[] = [];
  if (l1Key) breadcrumb.push(l1Key);
  if (l2Key) breadcrumb.push(l2Key);
  if (stateData.l3Key) breadcrumb.push(stateData.l3Key);

  const renderTiles = () => {
    if (authLoading || loading) return <LoadingSpinner />;

    switch (state) {
      case 'L1': {
        const keys = Object.keys(TILE_HIERARCHY);
        return (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 10 }}>
            {keys.map((k) => (
              <Tile key={k} label={k} onSelect={() => handleL1Select(k)} />
            ))}
          </div>
        );
      }

      case 'L2': {
        if (!l1Key) return null;
        const l2 = TILE_HIERARCHY[l1Key] as Record<string, string[] | null>;
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {Object.keys(l2).map((k) => (
              <Tile key={k} label={k} onSelect={() => handleL2Select(l1Key, k)} />
            ))}
          </div>
        );
      }

      case 'L3': {
        if (!l1Key || !l2Key) return null;
        const l3Items = (TILE_HIERARCHY[l1Key] as Record<string, string[] | null>)[l2Key] as string[];
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {l3Items.map((k) => (
              <Tile key={k} label={k} onSelect={() => handleL3Select(l1Key, l2Key, k)} />
            ))}
          </div>
        );
      }

      case 'SENTENCES':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(sentences ?? []).map((s, i) => (
              <Tile key={i} label={s} variant="sentence" fullWidth onSelect={() => handleSentenceSelect(s, i)} />
            ))}
            <Tile
              label="None of these"
              variant="danger"
              fullWidth
              onSelect={() => pushState({ ...stateData, state: 'NUDGE' })}
            />
          </div>
        );

      case 'NUDGE':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {NUDGE_OPTIONS.map((n) => (
              <Tile key={n} label={n} onSelect={() => handleNudge(n)} />
            ))}
          </div>
        );

      case 'KEYBOARD':
        return <KeyboardFallback disabled={loading} onSpeak={handleKeyboardSpeak} />;

      case 'YESNO': {
        const options = Object.keys(TILE_HIERARCHY['Yes / No'] as Record<string, null>);
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {options.map((o) => (
              <Tile key={o} label={o} onSelect={() => handleInstantSpeak(o)} />
            ))}
          </div>
        );
      }

      case 'QUICK': {
        const quickData = TILE_HIERARCHY['Quick phrase'] as Record<string, string[] | null>;
        if (!l2Key) {
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {Object.keys(quickData).map((k) => (
                <Tile
                  key={k}
                  label={k}
                  onSelect={() => {
                    if (quickData[k] === null) return;
                    pushState({ ...stateData, state: 'QUICK', l2Key: k });
                  }}
                />
              ))}
            </div>
          );
        }
        const phrases = quickData[l2Key] as string[];
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {phrases.map((p) => (
              <Tile key={p} label={p} onSelect={() => handleInstantSpeak(p)} />
            ))}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: '#1C1C1E',
        fontFamily: 'var(--font-dm-sans), DM Sans, system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          height: 56,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: '#1C1C1E',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <AudioWaveform size={18} style={{ color: '#00C9A7' }} />
          <span style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 500 }}>Kural</span>
        </Link>

        <span style={{ color: '#8E8E93', fontSize: 14 }}>{patientName || '…'}</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isMobile && (
            <button
              onClick={() => setShowConversation((v) => !v)}
              aria-label="Toggle conversation"
              style={{
                background: showConversation ? 'rgba(0,201,167,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${showConversation ? 'rgba(0,201,167,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 8,
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: showConversation ? '#00C9A7' : '#8E8E93',
                position: 'relative',
              }}
            >
              <MessageSquare size={15} />
              {!showConversation && conversation.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    background: '#00C9A7',
                    color: '#1C1C1E',
                    borderRadius: '50%',
                    width: 15,
                    height: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {conversation.length}
                </span>
              )}
            </button>
          )}
          {offline && (
            <span style={{ color: '#FF9F0A', fontSize: 12, fontWeight: 500 }}>
              {isMobile ? '●' : 'Offline mode'}
            </span>
          )}
          <motion.div
            style={{ width: 8, height: 8, borderRadius: 4, background: offline ? '#FF9F0A' : '#00C9A7' }}
            animate={offline ? {} : { opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Main tile area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: isMobile ? '12px' : '16px 20px', overflow: 'hidden' }}>
          <BreadcrumbPath path={breadcrumb} />

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${state}-${l1Key ?? ''}-${l2Key ?? ''}-${stateData.l3Key ?? ''}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' as const }}
              >
                {renderTiles()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Speaking indicator */}
          {speaking && (
            <div style={{ paddingTop: 12, flexShrink: 0 }}>
              <motion.div
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  background: 'rgba(0,201,167,0.10)',
                  border: '1px solid rgba(0,201,167,0.30)',
                  borderRadius: 20,
                  padding: '6px 14px',
                  color: '#00C9A7',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00C9A7', flexShrink: 0 }} />
                Speaking...
              </motion.div>
            </div>
          )}

          {/* Back button */}
          {history.length > 0 && !loading && (
            <div style={{ paddingTop: 12, flexShrink: 0 }}>
              <DwellButton
                onSelect={goBack}
                style={{
                  background: 'rgba(255,69,58,0.1)',
                  border: '1px solid rgba(255,69,58,0.3)',
                  borderRadius: 12,
                  padding: '12px 24px',
                  color: '#FF453A',
                  fontSize: 14,
                  fontWeight: 500,
                  display: 'inline-block',
                }}
              >
                ← Back
              </DwellButton>
            </div>
          )}
        </div>

        {/* Sidebar / bottom panel */}
        {(!isMobile || showConversation) && (
          <ConversationPanel
            entries={conversation}
            onCaregiverSend={handleCaregiverSend}
            onClearConversation={clearConversation}
            patientName={patientName}
            containerStyle={isMobile ? {
              width: '100%',
              height: 240,
              borderLeft: 'none',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0,
            } : undefined}
          />
        )}
      </div>
    </div>
  );
}
