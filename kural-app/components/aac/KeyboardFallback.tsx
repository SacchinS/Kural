'use client';

import { useState } from 'react';
import Tile from './Tile';
import DwellButton from './DwellButton';
import { KEYBOARD_GROUPS } from '@/lib/aac/tiles';

interface Props {
  disabled?: boolean;
  onSpeak: (text: string) => void;
}

export default function KeyboardFallback({ disabled = false, onSpeak }: Props) {
  const [typed, setTyped] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const handleGroup = (group: string) => {
    if (activeGroup === group) {
      setActiveGroup(null);
    } else {
      setActiveGroup(group);
    }
  };

  const handleLetter = (letter: string) => {
    setTyped((t) => t + letter);
    setActiveGroup(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', minHeight: 0 }}>
      <div
        style={{
          background: '#2C2C2E',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: '18px 22px',
          minHeight: 72,
          color: typed ? '#FFFFFF' : '#636366',
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: '0.05em',
        }}
      >
        {typed || 'Type here…'}
      </div>

      {activeGroup && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {activeGroup.split('').map((letter) => (
            <DwellButton
              key={letter}
              onSelect={() => handleLetter(letter)}
              style={{
                background: '#3A3A3C',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                width: 72,
                height: 72,
                color: '#FFFFFF',
                fontSize: 26,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {letter}
            </DwellButton>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, flex: 1, minHeight: 0 }}>
        {KEYBOARD_GROUPS.map((group) => (
          <Tile
            key={group}
            label={group}
            variant={activeGroup === group ? 'default' : 'default'}
            disabled={disabled}
            onSelect={() => handleGroup(group)}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <Tile
          label="⌫ Delete"
          variant="danger"
          disabled={disabled || typed.length === 0}
          onSelect={() => setTyped((t) => t.slice(0, -1))}
        />
        <Tile
          label="Space"
          disabled={disabled}
          onSelect={() => setTyped((t) => t + ' ')}
        />
        <Tile
          label="Speak"
          disabled={disabled || typed.trim().length === 0}
          onSelect={() => { onSpeak(typed.trim()); setTyped(''); }}
        />
      </div>
    </div>
  );
}
