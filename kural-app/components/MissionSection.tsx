'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function MissionSection() {
  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: '#1C1C1E' }}
    >
      <div
        className="orb"
        style={{ width: 700, height: 700, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      />
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block text-xs tracking-widest uppercase mb-8"
            style={{ color: '#00C9A7' }}
          >
            Why we built this
          </motion.span>

          <motion.p
            variants={fadeUp}
            className="mb-10 leading-tight"
            style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 500, color: '#FFFFFF' }}
          >
            35,000 people in the US live with ALS. Most will lose their voice. Almost none have a tool that preserves it.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mx-auto mb-10"
            style={{ height: 1, background: 'rgba(0,201,167,0.4)', maxWidth: 120 }}
          />

          <motion.p
            variants={fadeUp}
            style={{ color: '#8E8E93', fontSize: 17, lineHeight: 1.8, maxWidth: 640, margin: '0 auto' }}
          >
            We're a team of University of Washington computer science students who believe that the technology to solve this problem already exists — it just hasn't been applied where it's needed most. Kural is our attempt to close that gap. We're building for the people who deserve better tools, not for the people who make headlines.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
