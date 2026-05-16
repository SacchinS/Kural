'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  label: string;
  variant?: 'default' | 'sentence' | 'danger' | 'nudge';
  disabled?: boolean;
  onSelect: () => void;
  fullWidth?: boolean;
}

const DWELL_MS = 800;

export default function Tile({ label, variant = 'default', disabled = false, onSelect, fullWidth = false }: Props) {
  const [progress, setProgress] = useState(0); // 0-1
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const stopDwell = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    cancelAnimationFrame(rafRef.current);
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
        setProgress(0);
        onSelect();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [disabled, onSelect]);

  const bgColor = variant === 'danger'
    ? 'rgba(255,69,58,0.15)'
    : variant === 'sentence'
    ? '#2C2C2E'
    : '#2C2C2E';

  const borderColor = variant === 'danger'
    ? '#FF453A'
    : progress > 0
    ? '#00C9A7'
    : 'rgba(255,255,255,0.08)';

  const textColor = variant === 'danger' ? '#FF453A' : '#FFFFFF';
  const fontSize = variant === 'sentence' ? 17 : 15;

  // SVG ring
  const SIZE = 36;
  const R = 14;
  const CIRC = 2 * Math.PI * R;

  return (
    <motion.div
      style={{
        background: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 14,
        minHeight: 90,
        padding: variant === 'sentence' ? '16px 20px' : '12px 16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        position: 'relative',
        overflow: 'hidden',
        width: fullWidth ? '100%' : undefined,
        display: 'flex',
        alignItems: variant === 'sentence' ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        transition: 'border-color 0.15s',
        userSelect: 'none',
      }}
      whileHover={disabled ? {} : { scale: 1.01 }}
      onMouseEnter={startDwell}
      onMouseLeave={stopDwell}
      onClick={disabled ? undefined : onSelect}
    >
      <span style={{ color: textColor, fontSize, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>
        {label}
      </span>

      <AnimatePresence>
        {progress > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', top: 8, right: 8, width: SIZE, height: SIZE, flexShrink: 0 }}
          >
            <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(0,201,167,0.2)" strokeWidth={3} />
              <circle
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                fill="none"
                stroke="#00C9A7"
                strokeWidth={3}
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - progress)}
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
