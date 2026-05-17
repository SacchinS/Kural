'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioWaveform } from 'lucide-react';
import Link from 'next/link';
import { configureAmplify } from '@/lib/amplify';
import { fetchAuthSession, signOut as amplifySignOut } from 'aws-amplify/auth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    console.log('Navbar auth check started');
    configureAmplify();
    fetchAuthSession()
      .then(({ tokens }) => {
        console.log('Navbar tokens found', Boolean(tokens?.idToken));
        setSignedIn(!!tokens?.idToken);
      })
      .catch((err) => {
        console.log('Navbar auth check error', err);
        setSignedIn(false);
      });
  }, []);

  const handleSignOut = async () => {
    configureAmplify();
    await amplifySignOut();
    setSignedIn(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastY && y > 80);
      setLastY(y);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastY]);

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(28,28,30,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <AudioWaveform
              size={22}
              style={{ color: '#00C9A7' }}
              className="group-hover:scale-110 transition-transform duration-200"
            />
            <span
              className="text-xl tracking-tight"
              style={{ color: '#FFFFFF', fontWeight: 500 }}
            >
              Kural
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['For caregivers', 'How it works', 'Technology'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm transition-colors duration-200"
                style={{ color: '#8E8E93' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E93')}
              >
                {label}
              </a>
            ))}
            {signedIn ? (
              <motion.button
                onClick={handleSignOut}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                style={{
                  background: 'transparent',
                  color: '#8E8E93',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E93')}
              >
                Sign out
              </motion.button>
            ) : (
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                style={{
                  background: 'transparent',
                  color: '#8E8E93',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8E8E93')}
              >
                Sign in
              </motion.a>
            )}
            <motion.a
              href="/onboard"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{
                background: '#00C9A7',
                color: '#1C1C1E',
                fontWeight: 500,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = '#00957D')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = '#00C9A7')
              }
            >
              Get started
            </motion.a>
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
