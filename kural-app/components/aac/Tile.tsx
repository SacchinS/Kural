'use client';

import { motion } from 'framer-motion';

interface Props {
  label: string;
  variant?: 'default' | 'sentence' | 'danger' | 'nudge';
  disabled?: boolean;
  onSelect: () => void;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export default function Tile({ label, variant = 'default', disabled = false, onSelect, fullWidth = false, style }: Props) {
  const bgColor = variant === 'danger'
    ? 'rgba(255,69,58,0.15)'
    : variant === 'sentence'
    ? '#2C2C2E'
    : '#2C2C2E';

  const borderColor = variant === 'danger'
    ? '#FF453A'
    : 'rgba(255,255,255,0.08)';

  const textColor = variant === 'danger' ? '#FF453A' : '#FFFFFF';
  const fontSize = variant === 'sentence' ? 24 : 22;

  return (
    <motion.div
      style={{
        background: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 14,
        minHeight: variant === 'sentence' ? 112 : 104,
        padding: variant === 'sentence' ? '24px 28px' : '22px 26px',
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
        ...style,
      }}
      whileHover={disabled ? {} : { scale: 1.01 }}
      onClick={disabled ? undefined : onSelect}
    >
      <span style={{ color: textColor, fontSize, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>
        {label}
      </span>
    </motion.div>
  );
}
