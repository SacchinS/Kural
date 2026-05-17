'use client';

import { motion } from 'framer-motion';
import { Mic, User, Eye } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <Mic size={24} />,
    title: 'Bank your voice',
    body: 'Record sentences while you still can. Our pipeline trains a voice model on AWS SageMaker that captures your exact timbre, cadence, and inflection — not a generic synthetic voice.',
  },
  {
    number: '02',
    icon: <User size={24} />,
    title: 'Set up your profile',
    body: 'Tell us about your communication style, your family, your humor. Kural learns who you are — so the sentences it suggests sound like you, not a machine.',
  },
  {
    number: '03',
    icon: <Eye size={24} />,
    title: 'Speak with your eyes',
    body: 'Gaze at intent tiles. Kural generates full, contextually aware sentences via Amazon Bedrock. Your cloned voice plays them instantly — at conversational speed.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: '#1C1C1E' }}
    >
      <div className="orb" style={{ width: 500, height: 500, top: 100, left: -100 }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs tracking-widest uppercase mb-4"
            style={{ color: '#00C9A7' }}
          >
            The process
          </span>
          <h2
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, color: '#FFFFFF' }}
          >
            Three steps. One voice.
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="rounded-2xl p-8 flex flex-col"
              style={{
                background: '#2C2C2E',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,201,167,0.12)', color: '#00C9A7' }}
                >
                  {step.icon}
                </div>
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 500,
                    color: 'rgba(0,201,167,0.15)',
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </span>
              </div>
              <h3
                className="mb-3"
                style={{ fontSize: 20, fontWeight: 500, color: '#FFFFFF' }}
              >
                {step.title}
              </h3>
              <p style={{ color: '#8E8E93', lineHeight: 1.7, fontSize: 15 }}>
                {step.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
