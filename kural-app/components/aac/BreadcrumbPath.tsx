'use client';

interface Props {
  path: string[];
}

export default function BreadcrumbPath({ path }: Props) {
  if (path.length === 0) return null;
  return (
    <div className="flex items-center flex-wrap gap-2 px-1 pb-4" style={{ minHeight: 36 }}>
      {path.map((segment, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && (
            <span style={{ color: '#00C9A7', fontSize: 18, fontWeight: 500 }}>→</span>
          )}
          <span style={{ color: i === path.length - 1 ? '#FFFFFF' : '#8E8E93', fontSize: 18, fontWeight: 500 }}>
            {segment}
          </span>
        </span>
      ))}
    </div>
  );
}
