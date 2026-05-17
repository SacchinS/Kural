'use client';

interface Props {
  onSelect: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function DwellButton({ onSelect, disabled = false, style, children }: Props) {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onSelect}
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
    </div>
  );
}
