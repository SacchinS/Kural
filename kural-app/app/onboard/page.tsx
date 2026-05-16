'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AudioWaveform } from 'lucide-react';
import Link from 'next/link';
import Stepper from '@/components/onboard/Stepper';
import StepOne from '@/components/onboard/StepOne';
import StepTwo from '@/components/onboard/StepTwo';
import StepThree from '@/components/onboard/StepThree';
import StepFour from '@/components/onboard/StepFour';
import StepFive from '@/components/onboard/StepFive';

const pageVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export default function OnboardPage() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#1C1C1E' }}
    >
      <header
        className="px-6 h-16 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <AudioWaveform size={20} style={{ color: '#00C9A7' }} />
          <span style={{ fontWeight: 500, fontSize: 18, color: '#FFFFFF' }}>Kural</span>
        </Link>
        <span style={{ fontSize: 13, color: '#636366' }}>
          Step {step} of 5
        </span>
      </header>

      <div className="flex-1 flex flex-col px-6 py-12 max-w-2xl mx-auto w-full">
        <Stepper currentStep={step} />

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {step === 1 && <StepOne onNext={next} />}
              {step === 2 && <StepTwo onNext={next} onBack={back} />}
              {step === 3 && <StepThree onNext={next} onBack={back} />}
              {step === 4 && <StepFour onNext={next} onBack={back} />}
              {step === 5 && <StepFive />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
