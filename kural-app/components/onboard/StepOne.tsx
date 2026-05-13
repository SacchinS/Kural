'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface StepOneData {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

interface Props {
  onNext: (data: StepOneData) => void;
}

const inputClass = `
  w-full px-4 py-3 rounded-xl text-sm transition-all duration-200
`;

const inputStyle = {
  background: '#3A3A3C',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#FFFFFF',
  outline: 'none',
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function StepOne({ onNext }: Props) {
  const [data, setData] = useState<StepOneData>({
    fullName: '',
    email: '',
    password: '',
    role: 'patient',
  });

  const roles = [
    { value: 'patient', label: 'Patient', desc: 'I am using Kural for myself' },
    { value: 'caregiver', label: 'Caregiver', desc: 'I am setting this up for someone I care for' },
    { value: 'clinician', label: 'Clinician', desc: 'I am a healthcare provider' },
  ];

  const valid = data.fullName && data.email && data.password.length >= 8;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      className="max-w-md mx-auto"
    >
      <motion.h2
        variants={fadeUp}
        className="text-2xl mb-1"
        style={{ fontWeight: 500, color: '#FFFFFF' }}
      >
        Create your account
      </motion.h2>
      <motion.p variants={fadeUp} className="mb-8 text-sm" style={{ color: '#8E8E93' }}>
        Let's get you set up. This takes about two minutes.
      </motion.p>

      <div className="space-y-4">
        <motion.div variants={fadeUp}>
          <label className="block text-xs mb-1.5" style={{ color: '#8E8E93' }}>Full name</label>
          <input
            type="text"
            placeholder="Robert Chen"
            value={data.fullName}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            className={inputClass}
            style={inputStyle}
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="block text-xs mb-1.5" style={{ color: '#8E8E93' }}>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className={inputClass}
            style={inputStyle}
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="block text-xs mb-1.5" style={{ color: '#8E8E93' }}>Password</label>
          <input
            type="password"
            placeholder="Minimum 8 characters"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className={inputClass}
            style={inputStyle}
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="block text-xs mb-2" style={{ color: '#8E8E93' }}>I am a…</label>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setData({ ...data, role: role.value })}
                className="w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
                style={{
                  background:
                    data.role === role.value
                      ? 'rgba(0,201,167,0.1)'
                      : '#3A3A3C',
                  border: `1px solid ${data.role === role.value ? 'rgba(0,201,167,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 border-2 flex items-center justify-center"
                  style={{
                    borderColor: data.role === role.value ? '#00C9A7' : '#636366',
                  }}
                >
                  {data.role === role.value && (
                    <div className="w-2 h-2 rounded-full" style={{ background: '#00C9A7' }} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#FFFFFF' }}>{role.label}</div>
                  <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 1 }}>{role.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => valid && onNext(data)}
            className="w-full py-3.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: valid ? '#00C9A7' : 'rgba(255,255,255,0.06)',
              color: valid ? '#1C1C1E' : '#636366',
              cursor: valid ? 'pointer' : 'not-allowed',
              fontWeight: 500,
            }}
          >
            Continue →
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
