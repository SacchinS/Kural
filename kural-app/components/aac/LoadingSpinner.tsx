'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-3 py-16">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ width: 14, height: 14, borderRadius: 7, background: '#00C9A7' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
