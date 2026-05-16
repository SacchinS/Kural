'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Activity, Clock, User } from 'lucide-react';

const bullets = [
  'Self-service onboarding — record, upload, done in under an hour.',
  'Caregiver dashboard to update patient preferences, topics, and family names anytime.',
  'Automatic UI adaptation as gaze accuracy changes over time.',
];

function DashboardMockup() {
  const tabs = ['Patient Profile', 'Voice Status', 'Usage'];
  const [activeTab] = [0];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div
        className="flex items-center gap-2 px-5 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#2C2C2E' }}
      >
        <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F56' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#FEBC2E' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#27C840' }} />
        <span className="text-xs ml-3" style={{ color: '#636366' }}>Kural Caregiver Dashboard</span>
      </div>

      <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className="px-4 py-3 text-xs transition-colors"
            style={{
              color: i === activeTab ? '#00C9A7' : '#636366',
              borderBottom: i === activeTab ? '2px solid #00C9A7' : '2px solid transparent',
              background: 'transparent',
              cursor: 'default',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,201,167,0.12)' }}
          >
            <User size={22} style={{ color: '#00C9A7' }} />
          </div>
          <div>
            <div style={{ fontWeight: 500, color: '#FFFFFF', fontSize: 16 }}>Robert Chen</div>
            <div style={{ color: '#8E8E93', fontSize: 13 }}>ALS · Stage 3 · Caregiver: Linda Chen</div>
          </div>
          <div
            className="ml-auto px-2.5 py-1 rounded-full text-xs"
            style={{ background: 'rgba(0,201,167,0.12)', color: '#00C9A7' }}
          >
            Active
          </div>
        </div>

        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: '#2C2C2E', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} style={{ color: '#00C9A7' }} />
              <span style={{ fontSize: 13, color: '#8E8E93' }}>Voice model status</span>
            </div>
            <span style={{ fontSize: 13, color: '#00C9A7', fontWeight: 500 }}>Active</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: '#8E8E93' }} />
              <span style={{ fontSize: 13, color: '#8E8E93' }}>Last session</span>
            </div>
            <span style={{ fontSize: 13, color: '#FFFFFF' }}>Today at 2:14 PM</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 13, color: '#8E8E93' }}>Sentences this week</span>
            <span style={{ fontSize: 13, color: '#FFFFFF' }}>847</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 13, color: '#8E8E93' }}>Gaze accuracy</span>
            <span style={{ fontSize: 13, color: '#FFFFFF' }}>94%</span>
          </div>
        </div>

        <div>
          <div className="text-xs mb-2" style={{ color: '#636366' }}>Daily usage (this week)</div>
          <div className="flex items-end gap-1.5 h-16">
            {[60, 85, 70, 95, 80, 100, 847].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${(v / 100) * 100}%`,
                  maxHeight: '100%',
                  background: i === 6 ? '#00C9A7' : 'rgba(0,201,167,0.25)',
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} style={{ fontSize: 10, color: '#636366', flex: 1, textAlign: 'center' }}>{d}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span style={{ fontSize: 13, color: '#8E8E93' }}>Communication style</span>
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#FFFFFF' }}
          >
            Warm &amp; conversational
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          {['Family', 'Comfort', 'Medication', 'Entertainment'].map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'rgba(0,201,167,0.08)', color: '#00C9A7', border: '1px solid rgba(0,201,167,0.2)' }}
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function CaregiverSection() {
  return (
    <section
      id="for-caregivers"
      className="relative py-28 px-6"
      style={{ background: '#1C1C1E' }}
    >
      <div className="orb" style={{ width: 500, height: 500, top: '50%', right: -100, transform: 'translateY(-50%)' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-xs tracking-widest uppercase mb-4"
              style={{ color: '#00C9A7' }}
            >
              For caregivers
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mb-5"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 500, color: '#FFFFFF', lineHeight: 1.2 }}
            >
              You set it up.<br />It adapts over time.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mb-8"
              style={{ color: '#8E8E93', fontSize: 16, lineHeight: 1.7 }}
            >
              Kural is designed so caregivers can get started without technical support — and so the device evolves alongside the patient's changing needs.
            </motion.p>
            <motion.ul variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="space-y-4">
              {bullets.map((b, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <CheckCircle
                    size={18}
                    style={{ color: '#00C9A7', flexShrink: 0, marginTop: 2 }}
                  />
                  <span style={{ color: '#8E8E93', fontSize: 15, lineHeight: 1.6 }}>{b}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
