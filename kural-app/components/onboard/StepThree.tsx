'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Upload, CheckCircle } from 'lucide-react';
import { HARVARD_SENTENCES } from '@/lib/constants';
import { configureAmplify } from '@/lib/amplify';
import { fetchAuthSession } from 'aws-amplify/auth';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

type RecordingState = 'idle' | 'recording' | 'recorded' | 'playing';

export default function StepThree({ onNext, onBack }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [recorded, setRecorded] = useState<boolean[]>(Array(HARVARD_SENTENCES.length).fill(false));
  const [state, setState] = useState<RecordingState>('idle');
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [elapsed, setElapsed] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobsRef = useRef<(Blob | null)[]>(Array(HARVARD_SENTENCES.length).fill(null));
  const audioUrlRef = useRef<string | null>(null);
  const playingAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingStartRef = useRef<number>(0);

  const completedCount = recorded.filter(Boolean).length;
  const progress = (completedCount / HARVARD_SENTENCES.length) * 100;

  const startRecording = async () => {
    setError(null);
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioBlobsRef.current[currentIdx] = blob;
        audioUrlRef.current = URL.createObjectURL(blob);
        setState('recorded');
        const updated = [...recorded];
        updated[currentIdx] = true;
        setRecorded(updated);
      };

      mediaRecorder.start();
      setElapsed(0);
      recordingStartRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - recordingStartRef.current) / 1000));
      }, 200);
      setState('recording');
    } catch {
      setError('Microphone access denied. Please allow microphone permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    mediaRecorderRef.current?.stop();
  };

  const playback = () => {
    if (!audioUrlRef.current) return;
    setState('playing');
    const audio = new Audio(audioUrlRef.current);
    playingAudioRef.current = audio;
    audio.onended = () => setState('recorded');
    audio.play();
  };

  const next = () => {
    if (currentIdx < HARVARD_SENTENCES.length - 1) {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
      const nextIdx = currentIdx + 1;
      const existingBlob = audioBlobsRef.current[nextIdx];
      if (existingBlob) audioUrlRef.current = URL.createObjectURL(existingBlob);
      setCurrentIdx(nextIdx);
      setState(existingBlob ? 'recorded' : 'idle');
    }
  };

  const handleUpload = async () => {
    setError(null);
    setUploading(true);
    try {
      configureAmplify();
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken?.toString();
      if (!idToken) throw new Error('Not authenticated. Please sign in again.');

      const blobs = audioBlobsRef.current
        .map((b, i) => ({ blob: b, idx: i }))
        .filter((x): x is { blob: Blob; idx: number } => x.blob !== null);

      for (const { blob, idx } of blobs) {
        const formData = new FormData();
        formData.append('file', new File([blob], `sentence-${idx + 1}.webm`, { type: 'audio/webm' }));
        const res = await fetch('/api/voice', {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: formData,
        });
        if (!res.ok) throw new Error(`Upload failed for recording ${idx + 1}.`);
      }

      setUploaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto"
    >
      <h2 className="text-2xl mb-1" style={{ fontWeight: 500, color: '#FFFFFF' }}>
        Voice banking
      </h2>
      <p className="mb-6 text-sm" style={{ color: '#8E8E93' }}>
        Read each sentence aloud. We use these recordings to train a voice model that sounds exactly like you.
      </p>

      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: 'rgba(0,201,167,0.06)', border: '1px solid rgba(0,201,167,0.2)' }}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,201,167,0.15)' }}>
            <Mic size={14} style={{ color: '#00C9A7' }} />
          </div>
          <div>
            <p style={{ fontSize: 13, color: '#00C9A7', fontWeight: 500, marginBottom: 2 }}>What is voice banking?</p>
            <p style={{ fontSize: 13, color: '#8E8E93', lineHeight: 1.6 }}>
              Voice banking captures your natural voice before ALS affects your speech. These 20 sentences cover every phoneme in English — giving us enough data to train a high-quality voice model that will speak for you.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span style={{ fontSize: 13, color: '#8E8E93' }}>
          Sentence {currentIdx + 1} of {HARVARD_SENTENCES.length}
        </span>
        <span style={{ fontSize: 13, color: '#00C9A7', fontWeight: 500 }}>
          {completedCount} recorded
        </span>
      </div>

      <div className="w-full rounded-full mb-6" style={{ height: 4, background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="rounded-full"
          style={{ height: 4, background: '#00C9A7' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl p-8 mb-6 text-center"
          style={{ background: '#2C2C2E', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p style={{ fontSize: 22, color: '#FFFFFF', lineHeight: 1.5, fontWeight: 400 }}>
            {HARVARD_SENTENCES[currentIdx]}
          </p>
        </motion.div>
      </AnimatePresence>

      {error && (
        <p className="text-center text-sm mb-4" style={{ color: '#FF453A' }}>{error}</p>
      )}

      <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
        {state === 'idle' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium"
            style={{ background: '#FF3B30', color: '#FFFFFF' }}
          >
            <Mic size={16} /> Record
          </motion.button>
        )}

        {state === 'recording' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium relative"
            style={{ background: '#FF3B30', color: '#FFFFFF' }}
          >
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(255,59,48,0.4)', animation: 'pulse-ring 1.2s ease-out infinite' }}
            />
            <Square size={14} fill="white" />
            <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: '2.2ch' }}>
              {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
            </span>
          </motion.button>
        )}

        {(state === 'recorded' || state === 'playing') && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playback}
              disabled={state === 'playing'}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: state === 'playing' ? '#636366' : '#FFFFFF',
              }}
            >
              <Play size={14} /> {state === 'playing' ? 'Playing…' : 'Play back'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF' }}
            >
              <Mic size={14} /> Re-record
            </motion.button>
            {currentIdx < HARVARD_SENTENCES.length - 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={next}
                className="px-4 py-2.5 rounded-full text-sm font-medium"
                style={{ background: '#00C9A7', color: '#1C1C1E' }}
              >
                Next →
              </motion.button>
            )}
          </>
        )}
      </div>

      {completedCount >= 5 && !uploaded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: uploading ? 'rgba(255,255,255,0.06)' : 'rgba(0,201,167,0.12)',
              color: uploading ? '#636366' : '#00C9A7',
              border: '1px solid rgba(0,201,167,0.3)',
            }}
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: '#00C9A7', borderTopColor: 'transparent' }} />
                Uploading to S3…
              </>
            ) : (
              <>
                <Upload size={15} /> Upload {completedCount} recording{completedCount !== 1 ? 's' : ''} to S3
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {uploaded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4"
          style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.25)' }}
        >
          <CheckCircle size={16} style={{ color: '#00C9A7' }} />
          <span style={{ fontSize: 13, color: '#00C9A7' }}>
            Recordings uploaded ✓ — Your voice model will be ready within 4 hours
          </span>
        </motion.div>
      )}

      <div className="flex gap-3 mt-2">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#8E8E93' }}
        >
          ← Back
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="flex-1 py-3 rounded-xl text-sm font-medium"
          style={{
            background: completedCount >= 5 ? '#00C9A7' : 'rgba(255,255,255,0.06)',
            color: completedCount >= 5 ? '#1C1C1E' : '#636366',
            cursor: completedCount >= 5 ? 'pointer' : 'not-allowed',
            fontWeight: 500,
          }}
        >
          {completedCount >= 5 ? 'Continue →' : `Record at least 5 sentences to continue (${completedCount}/5)`}
        </motion.button>
      </div>
    </motion.div>
  );
}
