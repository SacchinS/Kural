'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Download, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

const summary = [
  { label: 'Account', value: 'Created & verified' },
  { label: 'Patient profile', value: 'Robert Chen · Warm & conversational' },
  { label: 'Voice banking', value: '20 sentences recorded · Model training in progress' },
  { label: 'Eye tracking', value: 'Configured via iOS Accessibility' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function StepFive() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-md mx-auto text-center"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(0,201,167,0.15)', border: '1.5px solid rgba(0,201,167,0.35)' }}
        >
          <CheckCircle size={36} style={{ color: '#00C9A7' }} />
        </motion.div>
        <motion.h2
          variants={itemVariants}
          className="text-2xl mb-2"
          style={{ fontWeight: 500, color: '#FFFFFF' }}
        >
          Your Kural device is ready
        </motion.h2>
        <motion.p variants={itemVariants} style={{ color: '#8E8E93', fontSize: 15 }}>
          Everything is set up. Robert's voice model will be ready within 4 hours.
        </motion.p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-5 mb-6 text-left"
        style={{ background: '#2C2C2E', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-xs mb-4 tracking-widest uppercase" style={{ color: '#636366' }}>
          Setup summary
        </p>
        <div className="space-y-3">
          {summary.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle size={14} style={{ color: '#00C9A7', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12, color: '#636366', marginBottom: 1 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: '#FFFFFF' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        <motion.a
          href="#"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-medium"
          style={{ background: '#00C9A7', color: '#1C1C1E', fontWeight: 500 }}
        >
          <Download size={15} /> Download Kural companion app
        </motion.a>
        <motion.a
          href="/"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-medium"
          style={{
            background: 'transparent',
            color: '#00C9A7',
            border: '1px solid rgba(0,201,167,0.4)',
          }}
        >
          <LayoutDashboard size={15} /> View caregiver dashboard
        </motion.a>
      </motion.div>

      <motion.p variants={itemVariants} className="mt-6 text-xs" style={{ color: '#636366' }}>
        Questions? Email us at{' '}
        <a href="mailto:support@kural.ai" style={{ color: '#00C9A7' }}>
          support@kural.ai
        </a>
      </motion.p>
    </motion.div>
  );
}
