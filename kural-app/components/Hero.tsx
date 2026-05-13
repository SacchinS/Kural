'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mic, Eye, AudioWaveform } from 'lucide-react';
import Link from 'next/link';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function Waveform() {
  const bars = [
    { h: 16, d: '0s', dur: '1.1s' },
    { h: 28, d: '0.1s', dur: '1.3s' },
    { h: 40, d: '0.05s', dur: '0.9s' },
    { h: 56, d: '0.2s', dur: '1.4s' },
    { h: 44, d: '0.15s', dur: '1.0s' },
    { h: 64, d: '0s', dur: '1.2s' },
    { h: 72, d: '0.25s', dur: '1.5s' },
    { h: 60, d: '0.1s', dur: '1.1s' },
    { h: 80, d: '0.3s', dur: '1.3s' },
    { h: 64, d: '0.05s', dur: '0.95s' },
    { h: 88, d: '0.2s', dur: '1.4s' },
    { h: 72, d: '0s', dur: '1.2s' },
    { h: 56, d: '0.15s', dur: '1.1s' },
    { h: 40, d: '0.25s', dur: '1.35s' },
    { h: 64, d: '0.1s', dur: '1.0s' },
    { h: 80, d: '0.05s', dur: '1.45s' },
    { h: 56, d: '0.2s', dur: '0.9s' },
    { h: 40, d: '0.3s', dur: '1.2s' },
    { h: 28, d: '0.1s', dur: '1.3s' },
    { h: 16, d: '0s', dur: '1.1s' },
  ];

  return (
    <div className="flex items-center justify-center gap-1.5 h-24 mt-12">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="waveform-bar rounded-full"
          style={{
            width: 3,
            height: bar.h,
            background: 'rgba(0, 201, 167, 0.35)',
            '--duration': bar.dur,
            '--delay': bar.d,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

const stats = [
  {
    icon: <AudioWaveform size={20} />,
    value: 60,
    suffix: ' WPM',
    prefix: '40–',
    label: 'Words per minute',
  },
  {
    icon: <Eye size={20} />,
    value: 2,
    suffix: '',
    prefix: '',
    label: 'Eye movements per sentence',
  },
  {
    icon: <Mic size={20} />,
    value: null,
    label: 'Your actual voice',
    static: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden"
      style={{ background: '#1C1C1E' }}
    >
      <div
        className="orb"
        style={{ width: 800, height: 800, top: -200, left: '50%', transform: 'translateX(-50%)' }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <motion.div variants={itemVariants}>
          <span
            className="inline-block px-3 py-1 rounded-full text-xs mb-8 tracking-widest uppercase"
            style={{
              background: 'rgba(0,201,167,0.12)',
              color: '#00C9A7',
              border: '1px solid rgba(0,201,167,0.25)',
            }}
          >
            AI-Powered AAC for ALS
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mb-6 leading-tight"
          style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 500, color: '#FFFFFF' }}
        >
          Give someone back<br />their voice.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mb-10 max-w-2xl mx-auto"
          style={{ fontSize: 18, color: '#8E8E93', lineHeight: 1.7 }}
        >
          Kural uses eye tracking and AI to let ALS patients speak in their own cloned voice
          — at 40–60 words per minute.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4">
          <motion.a
            href="/onboard"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-7 py-3.5 rounded-xl text-sm font-medium transition-colors duration-200"
            style={{ background: '#00C9A7', color: '#1C1C1E', fontWeight: 500 }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = '#00957D')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = '#00C9A7')
            }
          >
            Start voice banking
          </motion.a>
          <motion.a
            href="#how-it-works"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-7 py-3.5 rounded-xl text-sm font-medium transition-colors duration-200"
            style={{
              background: 'transparent',
              color: '#00C9A7',
              border: '1px solid #00C9A7',
            }}
          >
            See how it works
          </motion.a>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Waveform />
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="rounded-2xl p-6 text-center"
              style={{
                background: '#2C2C2E',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="flex items-center justify-center mb-3"
                style={{ color: '#00C9A7' }}
              >
                {stat.icon}
              </div>
              <div
                className="text-3xl mb-1"
                style={{ fontWeight: 500, color: '#FFFFFF' }}
              >
                {stat.static ? (
                  'Your voice'
                ) : (
                  <>
                    {stat.prefix}
                    <AnimatedCounter target={stat.value!} suffix={stat.suffix} />
                  </>
                )}
              </div>
              <div className="text-sm" style={{ color: '#8E8E93' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
