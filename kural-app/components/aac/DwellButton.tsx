'use client';

import { useRef, useState, useCallback } from 'react';

const DWELL_MS = 800;

interface Props {
  onSelect: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function DwellButton({ onSelect, disabled = false, style, children }: Props) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  const stopDwell = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    setProgress(0);
  }, []);

  const startDwell = useCallback(() => {
    if (disabled) return;
    startRef.current = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const p = Math.min(elapsed / DWELL_MS, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
        setProgress(0);
        onSelect();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [disabled, onSelect]);

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onMouseEnter={startDwell}
      onMouseLeave={stopDwell}
      onClick={disabled ? undefined : () => { stopDwell(); onSelect(); }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        userSelect: 'none',
        ...style,
      }}
    >
      {children}
      {progress > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 3,
            width: `${progress * 100}%`,
            background: '#00C9A7',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}
