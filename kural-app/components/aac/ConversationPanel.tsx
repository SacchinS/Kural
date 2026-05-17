'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { ConversationEntry } from '@/lib/aac/types';

interface Props {
  entries: ConversationEntry[];
  onCaregiverSend: (text: string) => void;
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

export default function ConversationPanel({ entries, onCaregiverSend }: Props) {
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
    doSend();
  }, [clearAutoSendTimer, doSend]);

  const displayValue = input + (interim ? (input ? ' ' : '') + interim : '');

  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        background: '#1C1C1E',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          color: '#8E8E93',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Conversation
      </div>

      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {entries.length === 0 && (
          <p style={{ color: '#636366', fontSize: 13, textAlign: 'center', marginTop: 24 }}>
            Conversation will appear here
          </p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              borderLeft: `3px solid ${entry.speaker === 'robert' ? '#00C9A7' : 'rgba(255,255,255,0.2)'}`,
              paddingLeft: 10,
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            <div style={{ color: entry.speaker === 'robert' ? '#00C9A7' : '#8E8E93', fontSize: 11, fontWeight: 500, marginBottom: 2 }}>
              {entry.speaker === 'robert' ? 'Robert' : 'Caregiver'}
            </div>
            <div style={{ color: '#FFFFFF', fontSize: 13, lineHeight: 1.4 }}>{entry.text}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: '10px 8px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
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
              borderRadius: 8,
              padding: '8px 10px',
              color: interim ? '#8E8E93' : '#FFFFFF',
              fontSize: 13,
              outline: 'none',
              transition: 'background 0.2s, border-color 0.2s',
            }}
          />
          {speechSupported && (
            <button
              onClick={toggleListening}
              title={listening ? 'Stop mic' : 'Start mic'}
              style={{
                background: listening ? 'rgba(255,69,58,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${listening ? 'rgba(255,69,58,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 8,
                padding: '0 10px',
                color: listening ? '#FF453A' : '#8E8E93',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
              }}
            >
              {listening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
          )}
          <button
            onClick={handleSend}
            style={{
              background: '#00C9A7',
              border: 'none',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#000',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </div>
        {listening && (
          <p style={{ fontSize: 11, color: '#FF453A', margin: 0, paddingLeft: 2 }}>
            Listening — will send automatically after a pause
          </p>
        )}
      </div>
    </div>
  );
}
