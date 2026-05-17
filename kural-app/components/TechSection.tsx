'use client';

import { motion } from 'framer-motion';
import { Brain, FlaskConical, Zap, Database, ShieldCheck, HardDrive } from 'lucide-react';

const techCards = [
  {
    icon: <Brain size={20} />,
    name: 'Amazon Bedrock',
    description: 'Context-aware sentence generation via Claude',
  },
  {
    icon: <FlaskConical size={20} />,
    name: 'Amazon SageMaker',
    description: 'Per-patient voice model training and synthesis',
  },
  {
    icon: <Zap size={20} />,
    name: 'AWS Lambda',
    description: 'Serverless orchestration of every API action',
  },
  {
    icon: <Database size={20} />,
    name: 'Amazon DynamoDB',
    description: 'Patient profiles and conversation history',
  },
  {
    icon: <ShieldCheck size={20} />,
    name: 'Amazon Cognito',
    description: 'Secure patient authentication and session management',
  },
  {
    icon: <HardDrive size={20} />,
    name: 'Amazon S3',
    description: 'Voice sample storage and synthesized audio delivery',
  },
];

const archNodes = [
  { label: 'iPhone', sub: 'Eye tracking' },
  { label: 'API Gateway', sub: 'REST API' },
  { label: 'Lambda', sub: 'Orchestrator' },
  { label: 'Bedrock', sub: 'LLM' },
  { label: 'SageMaker', sub: 'Voice model' },
  { label: 'S3', sub: 'Audio output' },
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
            Kural runs on a fully serverless AWS stack — eye input on iPhone feeds directly into API Gateway, Lambda, and Bedrock with no edge hardware required.
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
            className="text-center text-xs tracking-widest uppercase mb-8"
            style={{ color: '#636366' }}
          >
            Architecture overview
          </p>
          <div className="flex items-center justify-center flex-wrap gap-y-6 gap-x-0">
            {archNodes.map((node, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-2xl text-center"
                    style={{
                      background: '#1C1C1E',
                      border: '1px solid rgba(255,255,255,0.12)',
                      minWidth: 120,
                      padding: '16px 20px',
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#FFFFFF' }}>
                      {node.label}
                    </div>
                    <div style={{ fontSize: 12, color: '#636366', marginTop: 3 }}>
                      {node.sub}
                    </div>
                  </div>
                </div>
                {i < archNodes.length - 1 && (
                  <div className="flex items-center mx-2">
                    <div style={{ width: 32, height: 2, background: 'rgba(0,201,167,0.5)' }} />
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: '6px solid transparent',
                        borderBottom: '6px solid transparent',
                        borderLeft: '8px solid rgba(0,201,167,0.5)',
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
