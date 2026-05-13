'use client';

import { STEPS } from '@/lib/constants';

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12 overflow-x-auto px-4">
      {STEPS.map((step, i) => {
        const done = currentStep > step.id;
        const active = currentStep === step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300"
                style={{
                  background: done
                    ? '#00C9A7'
                    : active
                    ? 'rgba(0,201,167,0.2)'
                    : 'rgba(255,255,255,0.06)',
                  color: done ? '#1C1C1E' : active ? '#00C9A7' : '#636366',
                  border: active ? '1.5px solid #00C9A7' : done ? 'none' : '1.5px solid rgba(255,255,255,0.1)',
                }}
              >
                {done ? '✓' : step.id}
              </div>
              <span
                className="mt-2 text-xs whitespace-nowrap hidden sm:block"
                style={{ color: active ? '#00C9A7' : done ? '#8E8E93' : '#636366' }}
              >
                {step.label}
              </span>
              {'optional' in step && step.optional && (
                <span
                  className="text-xs whitespace-nowrap hidden sm:block"
                  style={{ color: '#636366', fontSize: 10 }}
                >
                  optional
                </span>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="mx-2 mb-4 sm:mb-5 transition-all duration-500"
                style={{
                  width: 'clamp(20px, 5vw, 48px)',
                  height: 1.5,
                  background:
                    currentStep > step.id
                      ? '#00C9A7'
                      : 'rgba(255,255,255,0.08)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
