'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const letters = "I love you".split('');

function OldAAC() {
  const [typed, setTyped] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    const typer = setInterval(() => {
      if (i < letters.length) {
        setTyped((prev) => [...prev, letters[i]]);
        i++;
      } else {
        clearInterval(typer);
      }
    }, 4200);

    return () => {
      clearInterval(interval);
      clearInterval(typer);
    };
  }, [inView]);

  return (
    <div ref={ref} className="rounded-2xl p-6" style={{ background: '#3A3A3C', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ background: '#FF453A' }} />
        <span className="text-xs" style={{ color: '#8E8E93' }}>Current AAC device</span>
      </div>
      <div
        className="rounded-xl p-4 mb-4 min-h-[56px] flex items-center"
        style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span style={{ fontSize: 20, color: '#FFFFFF', letterSpacing: 2 }}>
          {typed.join('')}
          <span className="cursor-blink" style={{ color: '#636366' }}>|</span>
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1.5 mb-4">
        {letters.map((l, i) => (
          <div
            key={i}
            className="rounded-lg flex items-center justify-center text-sm"
            style={{
              height: 36,
              background: typed.includes(l) ? 'rgba(0,201,167,0.15)' : '#2C2C2E',
              color: typed.includes(l) ? '#00C9A7' : '#8E8E93',
              border: `1px solid ${typed.includes(l) ? 'rgba(0,201,167,0.3)' : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.3s',
              fontWeight: 500,
            }}
          >
            {l === ' ' ? '⎵' : l.toUpperCase()}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#636366' }}>Scanning letter by letter…</span>
        <span className="text-xs font-medium" style={{ color: '#FF453A' }}>{seconds}s elapsed</span>
      </div>
    </div>
  );
}

function KuralAAC() {
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const steps = [
    { label: 'Intent detected: "Express affection"', icon: '👁️' },
    { label: 'Context: family nearby, evening', icon: '🧠' },
    { label: '"I love you, and I\'m so grateful you\'re here."', icon: '🔊', final: true },
  ];

  useEffect(() => {
    if (!inView) return;
    let elapsed = 0;
    const tick = setInterval(() => {
      elapsed += 1;
      setSeconds(elapsed);
      if (elapsed === 1) setStep(1);
      if (elapsed === 2) setStep(2);
      if (elapsed >= 3) {
        clearInterval(tick);
      }
    }, 700);
    return () => clearInterval(tick);
  }, [inView]);

  return (
    <div ref={ref} className="rounded-2xl p-6" style={{ background: '#3A3A3C', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ background: '#00C9A7' }} />
        <span className="text-xs" style={{ color: '#8E8E93' }}>Kural</span>
      </div>
      <div className="space-y-3 mb-4">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: step > i ? 1 : 0.2, x: step > i ? 0 : -12 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-3 rounded-xl p-3"
            style={{
              background: s.final && step > i ? 'rgba(0,201,167,0.12)' : '#2C2C2E',
              border: `1px solid ${s.final && step > i ? 'rgba(0,201,167,0.25)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <span style={{ fontSize: 16 }}>{s.icon}</span>
            <span
              className="text-sm"
              style={{
                color: s.final && step > i ? '#FFFFFF' : '#8E8E93',
                fontWeight: s.final && step > i ? 500 : 400,
              }}
            >
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#636366' }}>2 eye movements total</span>
        <span className="text-xs font-medium" style={{ color: '#00C9A7' }}>{seconds < 3 ? `${seconds}s` : '2s ✓'}</span>
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function ProblemSection() {
  return (
    <section className="relative py-28 px-6 overflow-hidden" style={{ background: '#1C1C1E' }}>
      <div className="orb" style={{ width: 600, height: 600, bottom: -200, right: -100 }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, color: '#FFFFFF' }}
          >
            ALS takes the voice.<br />We give it back.
          </motion.h2>
          <motion.p variants={fadeUp} style={{ color: '#8E8E93', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
            Today's AAC devices were designed for motor control, not for someone whose eyes are their only window left.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="mb-3">
              <span className="text-xs tracking-widest uppercase" style={{ color: '#8E8E93' }}>
                Without Kural
              </span>
            </div>
            <OldAAC />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const, delay: 0.15 } } }}
          >
            <div className="mb-3">
              <span className="text-xs tracking-widest uppercase" style={{ color: '#00C9A7' }}>
                With Kural
              </span>
            </div>
            <KuralAAC />
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto"
        >
          <p
            className="italic"
            style={{
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              color: '#8E8E93',
              lineHeight: 1.5,
              fontFamily: 'Georgia, serif',
            }}
          >
            "The eyes are the last thing ALS takes.<br />We built for that moment."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
