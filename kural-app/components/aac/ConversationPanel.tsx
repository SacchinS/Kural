'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { ConversationEntry } from '@/lib/aac/types';
import DwellButton from './DwellButton';

interface Props {
  entries: ConversationEntry[];
  onCaregiverSend: (text: string) => void;
  onClearConversation: () => void;
  patientName?: string;
  containerStyle?: React.CSSProperties;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

const AUTO_SEND_DELAY = 2000; // ms of silence before auto-sending

export default function ConversationPanel({ entries, onCaregiverSend, onClearConversation, patientName, containerStyle }: Props) {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const sessionFinalRef = useRef('');
  const listeningRef = useRef(false);
  const autoSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSpeechSupported(
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const clearAutoSendTimer = useCallback(() => {
    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }
  }, []);

  const doSend = useCallback(() => {
    clearAutoSendTimer();
    const text = sessionFinalRef.current.trim();
    if (!text) return;
    onCaregiverSend(text);
    sessionFinalRef.current = '';
    setInput('');
  }, [clearAutoSendTimer, onCaregiverSend]);

  const stopListening = useCallback(() => {
    clearAutoSendTimer();
    listeningRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
    setInterim('');
  }, [clearAutoSendTimer]);

  const startInstance = useCallback(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR || !listeningRef.current) return;

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      // new speech arrived — cancel any pending auto-send
      clearAutoSendTimer();
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          sessionFinalRef.current += t + ' ';
        } else {
          interimText += t;
        }
      }
      setInput(sessionFinalRef.current);
      setInterim(interimText);
    };

    rec.onerror = (e: any) => {
      if (e.error === 'no-speech') return;
      stopListening();
    };

    rec.onend = () => {
      setInterim('');
      recognitionRef.current = null;
      if (!listeningRef.current) return;

      // if there's accumulated text, start the auto-send countdown
      if (sessionFinalRef.current.trim()) {
        autoSendTimerRef.current = setTimeout(() => {
          doSend();
        }, AUTO_SEND_DELAY);
      }

      // restart instance to keep listening
      startInstance();
    };

    recognitionRef.current = rec;
    rec.start();
  }, [clearAutoSendTimer, doSend, stopListening]);

  const startListening = useCallback(() => {
    sessionFinalRef.current = '';
    listeningRef.current = true;
    setListening(true);
    startInstance();
  }, [startInstance]);

  const toggleListening = useCallback(() => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  }, [listening, startListening, stopListening]);

  const handleSend = useCallback(() => {
    clearAutoSendTimer();
    // prefer speech buffer; fall back to manually typed input
    const text = (sessionFinalRef.current || input).trim();
    if (!text) return;
    onCaregiverSend(text);
    sessionFinalRef.current = '';
    setInput('');
  }, [clearAutoSendTimer, input, onCaregiverSend]);

  const displayValue = input + (interim ? (input ? ' ' : '') + interim : '');

  return (
    <div
      style={{
        width: 420,
        maxWidth: '42vw',
        flexShrink: 0,
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        background: '#1C1C1E',
        ...containerStyle,
      }}
    >
      <div
        style={{
          padding: '16px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: '#8E8E93', fontSize: 16, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Conversation
        </span>
        {entries.length > 0 && (
          <DwellButton
            onSelect={onClearConversation}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,69,58,0.3)',
              borderRadius: 10,
              padding: '14px 18px',
              color: '#FF453A',
              fontSize: 17,
              fontWeight: 500,
              minHeight: 56,
              minWidth: 96,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Clear
          </DwellButton>
        )}
      </div>

      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}
      >
        {entries.length === 0 && (
          <p style={{ color: '#636366', fontSize: 18, textAlign: 'center', marginTop: 32, lineHeight: 1.4 }}>
            Conversation will appear here
          </p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              borderLeft: `3px solid ${entry.speaker === 'robert' ? '#00C9A7' : 'rgba(255,255,255,0.2)'}`,
              paddingLeft: 14,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <div style={{ color: entry.speaker === 'robert' ? '#00C9A7' : '#8E8E93', fontSize: 15, fontWeight: 500, marginBottom: 5 }}>
              {entry.speaker === 'robert' ? (patientName || 'Patient') : 'Caregiver'}
            </div>
            <div style={{ color: '#FFFFFF', fontSize: 20, lineHeight: 1.45 }}>{entry.text}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: '16px 14px 18px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={displayValue}
            onChange={(e) => {
              if (!listening) setInput(e.target.value);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={listening ? 'Listening…' : 'Caregiver message…'}
            style={{
              flex: 1,
              background: listening ? 'rgba(255,69,58,0.08)' : '#2C2C2E',
              border: `1px solid ${listening ? 'rgba(255,69,58,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 10,
              padding: '16px 14px',
              color: interim ? '#8E8E93' : '#FFFFFF',
              fontSize: 18,
              outline: 'none',
              transition: 'background 0.2s, border-color 0.2s',
              minHeight: 64,
              minWidth: 0,
            }}
          />
          {speechSupported && (
            <DwellButton
              onSelect={toggleListening}
              style={{
                background: listening ? 'rgba(255,69,58,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${listening ? 'rgba(255,69,58,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 10,
                padding: 0,
                color: listening ? '#FF453A' : '#8E8E93',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 64,
                minWidth: 64,
              }}
            >
              {listening ? <MicOff size={28} /> : <Mic size={28} />}
            </DwellButton>
          )}
          <DwellButton
            onSelect={handleSend}
            style={{
              background: '#00C9A7',
              borderRadius: 10,
              padding: '16px 20px',
              color: '#000',
              fontSize: 18,
              fontWeight: 500,
              minHeight: 64,
              minWidth: 92,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Send
          </DwellButton>
        </div>
        {listening && (
          <p style={{ fontSize: 15, color: '#FF453A', margin: 0, paddingLeft: 2, lineHeight: 1.3 }}>
            Listening — will send automatically after a pause
          </p>
        )}
      </div>
    </div>
  );
}
