'use client';

import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AudioWaveform } from 'lucide-react';
import Link from 'next/link';

import { AACState, AACStateData, ConversationEntry } from '@/lib/aac/types';
import { TILE_HIERARCHY, NUDGE_OPTIONS } from '@/lib/aac/tiles';
import { generateSentences, regenerateSentences, logSelection, appendExchange } from '@/lib/aac/api';

import Tile from './Tile';
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
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const { sentences, offline: isOffline } = await generateSentences(intentPath);
    setOffline(isOffline);
    setLoading(false);
    pushState({ state: 'SENTENCES', l1Key, l2Key, intentPath, sentences });
  }, [pushState]);

  // ── L3 ──────────────────────────────────────────────────────────────────────
  const handleL3Select = useCallback(async (l1Key: string, l2Key: string, l3Key: string) => {
    const intentPath = `${l1Key} → ${l2Key} → ${l3Key}`;
    setLoading(true);
    const { sentences, offline: isOffline } = await generateSentences(intentPath);
    setOffline(isOffline);
    setLoading(false);
    pushState({ state: 'SENTENCES', l1Key, l2Key, l3Key: l3Key, intentPath, sentences });
  }, [pushState]);

  // ── SENTENCES ────────────────────────────────────────────────────────────────
  const handleSentenceSelect = useCallback((sentence: string, index: number) => {
    const { intentPath, sentences } = stateRef.current;
    speak(sentence);
    addEntry(sentence, 'robert');
    logSelection(intentPath ?? '', sentences ?? [], index);
    appendExchange(sentence);
    setHistory([]);
    setStateData({ state: 'L1' });
    resetToL1();
  }, [addEntry, resetToL1]);

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
    );
    setOffline(isOffline);
    setLoading(false);
    pushState({ ...current, state: 'SENTENCES', sentences: newSentences, previousOptions: current.sentences });
  }, [pushState]);

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
    appendExchange(text);
    setHistory([]);
    setStateData({ state: 'L1' });
    resetToL1();
  }, [addEntry, resetToL1]);

  // ── Caregiver ────────────────────────────────────────────────────────────────
  const handleCaregiverSend = useCallback((text: string) => {
    addEntry(text, 'caregiver');
  }, [addEntry]);

  // ── Render tiles ─────────────────────────────────────────────────────────────
  const { state, l1Key, l2Key, intentPath, sentences } = stateData;

  const breadcrumb: string[] = [];
  if (l1Key) breadcrumb.push(l1Key);
  if (l2Key) breadcrumb.push(l2Key);
  if (stateData.l3Key) breadcrumb.push(stateData.l3Key);

  const renderTiles = () => {
    if (loading) return <LoadingSpinner />;

    switch (state) {
      case 'L1': {
        const keys = Object.keys(TILE_HIERARCHY);
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
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

        <span style={{ color: '#8E8E93', fontSize: 14 }}>Robert</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {offline && (
            <span style={{ color: '#FF9F0A', fontSize: 12, fontWeight: 500 }}>Offline mode</span>
          )}
          <motion.div
            style={{ width: 8, height: 8, borderRadius: 4, background: offline ? '#FF9F0A' : '#00C9A7' }}
            animate={offline ? {} : { opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main tile area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 20px', overflow: 'hidden' }}>
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

          {/* Back button */}
          {history.length > 0 && !loading && (
            <div style={{ paddingTop: 12, flexShrink: 0 }}>
              <button
                onClick={goBack}
                style={{
                  background: 'rgba(255,69,58,0.1)',
                  border: '1px solid rgba(255,69,58,0.3)',
                  borderRadius: 12,
                  padding: '12px 24px',
                  color: '#FF453A',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                ← Back
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <ConversationPanel entries={conversation} onCaregiverSend={handleCaregiverSend} />
      </div>
    </div>
  );
}
