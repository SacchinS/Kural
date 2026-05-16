'use client';

import { motion } from 'framer-motion';
import { Brain, FlaskConical, Zap, Database, Wifi, HardDrive } from 'lucide-react';

const techCards = [
  {
    icon: <Brain size={20} />,
    name: 'Amazon Bedrock',
    description: 'Context-aware sentence generation',
  },
  {
    icon: <FlaskConical size={20} />,
    name: 'Amazon SageMaker',
    description: 'Per-patient voice model training',
  },
  {
    icon: <Zap size={20} />,
    name: 'AWS Lambda',
    description: 'Real-time inference orchestration',
  },
  {
    icon: <Database size={20} />,
    name: 'Amazon DynamoDB',
    description: 'Patient profiles and conversation history',
  },
  {
    icon: <Wifi size={20} />,
    name: 'AWS IoT Greengrass',
    description: 'Edge gaze processing',
  },
  {
    icon: <HardDrive size={20} />,
    name: 'Amazon S3',
    description: 'Secure voice sample storage',
  },
];

const archNodes = [
  { label: 'Camera', sub: 'Eye tracker' },
  { label: 'Greengrass', sub: 'Edge' },
  { label: 'Lambda', sub: 'Orchestrator' },
  { label: 'Bedrock', sub: 'LLM' },
  { label: 'SageMaker', sub: 'Voice model' },
  { label: 'Speaker', sub: 'Output' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function TechSection() {
  return (
    <section
      id="technology"
      className="relative py-28 px-6"
      style={{ background: '#2C2C2E' }}
    >
      <div className="max-w-6xl mx-auto">
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
            Infrastructure
          </span>
          <h2
            className="mb-3"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 500, color: '#FFFFFF' }}
          >
            Powered by AWS
          </h2>
          <p style={{ color: '#8E8E93', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
            Kural is built on a production-grade AWS architecture — scalable, secure, and clinically ready.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
        >
          {techCards.map((card, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="rounded-2xl p-6 flex items-start gap-4"
              style={{
                background: '#3A3A3C',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,201,167,0.12)', color: '#00C9A7' }}
              >
                {card.icon}
              </div>
              <div>
                <div
                  className="mb-1"
                  style={{ fontSize: 15, fontWeight: 500, color: '#FFFFFF' }}
                >
                  {card.name}
                </div>
                <div style={{ fontSize: 13, color: '#8E8E93', lineHeight: 1.5 }}>
                  {card.description}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
        >
          <p
            className="text-center text-xs tracking-widest uppercase mb-6"
            style={{ color: '#636366' }}
          >
            Architecture overview
          </p>
          <div className="flex items-center justify-center flex-wrap gap-0 overflow-x-auto">
            {archNodes.map((node, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-xl px-4 py-3 text-center"
                    style={{
                      background: '#1C1C1E',
                      border: '1px solid rgba(255,255,255,0.1)',
                      minWidth: 88,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#FFFFFF' }}>
                      {node.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#636366', marginTop: 2 }}>
                      {node.sub}
                    </div>
                  </div>
                </div>
                {i < archNodes.length - 1 && (
                  <div className="flex items-center mx-1">
                    <div style={{ width: 24, height: 1.5, background: 'rgba(0,201,167,0.5)' }} />
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: '5px solid transparent',
                        borderBottom: '5px solid transparent',
                        borderLeft: '7px solid rgba(0,201,167,0.5)',
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
