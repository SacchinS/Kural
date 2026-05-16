'use client';

import { motion } from 'framer-motion';
import { Eye, Smartphone } from 'lucide-react';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const steps = [
  { step: '1', text: 'Open Settings on your iPhone' },
  { step: '2', text: 'Tap Accessibility → Eye Tracking' },
  { step: '3', text: 'Tap "Set Up Eye Tracking" and follow the prompts' },
  { step: '4', text: 'Return to Kural when calibration is complete' },
];

export default function StepFour({ onNext, onBack }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto"
    >
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-2xl" style={{ fontWeight: 500, color: '#FFFFFF' }}>
          Eye tracking setup
        </h2>
        <span
          className="px-2 py-0.5 rounded-full text-xs"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#8E8E93', fontWeight: 500 }}
        >
          Optional
        </span>
      </div>
      <p className="mb-6 text-sm" style={{ color: '#8E8E93' }}>
        Kural uses iPhone&rsquo;s built-in Eye Tracking — no extra hardware needed.
      </p>

      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: 'rgba(0,201,167,0.06)', border: '1px solid rgba(0,201,167,0.2)' }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,201,167,0.15)' }}
          >
            <Eye size={14} style={{ color: '#00C9A7' }} />
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#00C9A7', fontWeight: 500, marginBottom: 4 }}>
              Powered by iOS Accessibility
            </p>
            <p style={{ fontSize: 13, color: '#8E8E93', lineHeight: 1.6 }}>
              iPhone&rsquo;s Eye Tracking (iOS 18+) uses the TrueDepth front camera to track your gaze
              across all apps. You only need to calibrate once in iOS Settings — Kural picks it up automatically.
            </p>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: '#2C2C2E', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Smartphone size={14} style={{ color: '#8E8E93' }} />
          <p style={{ fontSize: 12, color: '#8E8E93', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Setup steps
          </p>
        </div>
        <div className="space-y-4">
          {steps.map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,201,167,0.15)', fontSize: 11, color: '#00C9A7', fontWeight: 600 }}
              >
                {step}
              </div>
              <p style={{ fontSize: 14, color: '#FFFFFF', lineHeight: 1.5, paddingTop: 2 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#8E8E93' }}
        >
          ← Back
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="flex-1 py-3 rounded-xl text-sm font-medium"
          style={{ background: '#00C9A7', color: '#1C1C1E', fontWeight: 500 }}
        >
          Next →
        </motion.button>
      </div>
    </motion.div>
  );
}
