'use client';

import { AudioWaveform } from 'lucide-react';
import Link from 'next/link';

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Technology', href: '#technology' },
  { label: 'For caregivers', href: '#for-caregivers' },
  { label: 'Contact', href: 'mailto:hello@kural.ai' },
];

export default function Footer() {
  return (
    <footer
      className="relative z-10"
      style={{ background: '#1C1C1E', borderTop: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AudioWaveform size={20} style={{ color: '#00C9A7' }} />
              <span style={{ fontWeight: 500, fontSize: 18, color: '#FFFFFF' }}>Kural</span>
            </div>
            <p style={{ color: '#636366', fontSize: 14 }}>Voice, preserved.</p>
          </div>

          <nav className="flex flex-wrap gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm transition-colors duration-200"
                style={{ color: '#8E8E93' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E93')}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p style={{ fontSize: 13, color: '#636366' }}>
            © {new Date().getFullYear()} Kural. All rights reserved.
          </p>
          <p style={{ fontSize: 13, color: '#636366' }}>
            Built at University of Washington
          </p>
        </div>
      </div>
    </footer>
  );
}
