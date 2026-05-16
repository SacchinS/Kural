'use client';

import { useEffect, useRef, useState } from 'react';
import { ConversationEntry } from '@/lib/aac/types';

interface Props {
  entries: ConversationEntry[];
  onCaregiverSend: (text: string) => void;
}

export default function ConversationPanel({ entries, onCaregiverSend }: Props) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onCaregiverSend(text);
    setInput('');
  };

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
          gap: 6,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Caregiver message…"
          style={{
            flex: 1,
            background: '#2C2C2E',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '8px 10px',
            color: '#FFFFFF',
            fontSize: 13,
            outline: 'none',
          }}
        />
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
    </div>
  );
}
