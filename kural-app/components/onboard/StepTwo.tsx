'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { DAILY_TOPICS } from '@/lib/constants';

interface Props {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  saving?: boolean;
  saveError?: string;
}

const inputStyle = {
  background: '#3A3A3C',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#FFFFFF',
  outline: 'none',
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function StepTwo({ onNext, onBack, saving = false, saveError = '' }: Props) {
  const [patientName, setPatientName] = useState('');
  const [diagnosisDate, setDiagnosisDate] = useState('');
  const [style, setStyle] = useState('warm');
  const [language, setLanguage] = useState('English');
  const [familyMembers, setFamilyMembers] = useState<string[]>(['']);
  const [topics, setTopics] = useState<string[]>(['Family', 'Comfort']);

  const styles = [
    { value: 'brief', label: 'Brief & direct' },
    { value: 'warm', label: 'Warm & conversational' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'formal', label: 'Formal' },
  ];

  const addMember = () => setFamilyMembers([...familyMembers, '']);
  const removeMember = (i: number) =>
    setFamilyMembers(familyMembers.filter((_, idx) => idx !== i));
  const updateMember = (i: number, val: string) => {
    const updated = [...familyMembers];
    updated[i] = val;
    setFamilyMembers(updated);
  };

  const toggleTopic = (topic: string) =>
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );

  const valid = patientName.length > 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
      className="max-w-lg mx-auto"
    >
      <motion.h2 variants={fadeUp} className="text-2xl mb-1" style={{ fontWeight: 500, color: '#FFFFFF' }}>
        Patient profile
      </motion.h2>
      <motion.p variants={fadeUp} className="mb-8 text-sm" style={{ color: '#8E8E93' }}>
        This helps Kural generate sentences that sound like the patient, not a machine.
      </motion.p>

      <div className="space-y-5">
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8E8E93' }}>Patient name</label>
            <input
              type="text"
              placeholder="Robert Chen"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8E8E93' }}>Diagnosis date</label>
            <input
              type="month"
              value={diagnosisDate}
              onChange={(e) => setDiagnosisDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8E8E93' }}>Communication style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ ...inputStyle, colorScheme: 'dark' }}
            >
              {styles.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#8E8E93' }}>Primary language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ ...inputStyle, colorScheme: 'dark' }}
            >
              {['English', 'Spanish', 'French', 'Mandarin', 'Tamil', 'Hindi', 'Arabic'].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="block text-xs mb-2" style={{ color: '#8E8E93' }}>Key family members</label>
          <div className="space-y-2">
            {familyMembers.map((member, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g. Linda (wife)`}
                  value={member}
                  onChange={(e) => updateMember(i, e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm"
                  style={inputStyle}
                />
                {familyMembers.length > 1 && (
                  <button
                    onClick={() => removeMember(i)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', color: '#8E8E93' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addMember}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: '#00C9A7' }}
            >
              <Plus size={14} /> Add family member
            </button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="block text-xs mb-2" style={{ color: '#8E8E93' }}>Common daily topics</label>
          <div className="flex flex-wrap gap-2">
            {DAILY_TOPICS.map((topic) => {
              const selected = topics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className="px-3 py-1.5 rounded-full text-xs transition-all duration-200"
                  style={{
                    background: selected ? 'rgba(0,201,167,0.15)' : 'rgba(255,255,255,0.06)',
                    color: selected ? '#00C9A7' : '#8E8E93',
                    border: `1px solid ${selected ? 'rgba(0,201,167,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </motion.div>

        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-3 rounded-xl text-sm"
            style={{
              background: 'rgba(255,69,58,0.12)',
              border: '1px solid rgba(255,69,58,0.25)',
              color: '#FF453A',
            }}
          >
            {saveError}
          </motion.div>
        )}

        <motion.div variants={fadeUp} className="flex gap-3 pt-2">
          <button
            onClick={onBack}
            disabled={saving}
            className="px-5 py-3 rounded-xl text-sm transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#8E8E93' }}
          >
            ← Back
          </button>
          <motion.button
            whileHover={{ scale: saving || !valid ? 1 : 1.02 }}
            whileTap={{ scale: saving || !valid ? 1 : 0.98 }}
            onClick={() => !saving && valid && onNext({ patientName, diagnosisDate, style, language, familyMembers, topics })}
            disabled={saving || !valid}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: saving || !valid ? 'rgba(255,255,255,0.06)' : '#00C9A7',
              color: saving || !valid ? '#636366' : '#1C1C1E',
              cursor: saving || !valid ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            {saving ? 'Saving…' : 'Continue →'}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
