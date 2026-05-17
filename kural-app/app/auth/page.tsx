'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AudioWaveform, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { configureAmplify } from '@/lib/amplify';
import {
  signIn,
  signUp,
  confirmSignUp,
  getCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth';

type Mode = 'signin' | 'signup' | 'confirm';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    configureAmplify();
    getCurrentUser()
      .then(() => router.replace('/aac'))
      .catch(() => {});
  }, [router]);

  const switchMode = (next: Mode) => {
    setError('');
    setMode(next);
  };

  // ── Sign in ──────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      console.log('signIn result — isSignedIn:', isSignedIn, 'nextStep:', nextStep.signInStep);
      if (!isSignedIn) throw new Error(`Sign-in incomplete: ${nextStep.signInStep}`);
      const { tokens } = await fetchAuthSession();
      console.log('session hydrated', Boolean(tokens?.idToken));
      if (!tokens?.idToken) throw new Error('Session not established after sign-in.');
      router.push('/aac');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Sign up ──────────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await signUp({ username: email, password, options: { userAttributes: { email } } });
      switchMode('confirm');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Confirm + auto sign-in ────────────────────────────────────────────────
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      if (!isSignedIn) throw new Error(`Sign-in incomplete after confirmation: ${nextStep.signInStep}`);
      const { tokens } = await fetchAuthSession();
      if (!tokens?.idToken) throw new Error('Session not established after confirmation.');
      router.push('/onboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px 14px 44px',
    background: '#2C2C2E',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#FFFFFF',
    fontSize: 16,
    outline: 'none',
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#636366',
    pointerEvents: 'none',
  };

  const btnPrimary: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    background: '#00C9A7',
    color: '#1C1C1E',
    border: 'none',
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 600,
    cursor: submitting ? 'not-allowed' : 'pointer',
    opacity: submitting ? 0.7 : 1,
  };

  const btnLink: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#00C9A7',
    cursor: 'pointer',
    fontSize: 14,
    padding: 0,
  };

  const titles: Record<Mode, { heading: string; sub: string }> = {
    signin: { heading: 'Welcome back', sub: 'Sign in to your Kural account' },
    signup: { heading: 'Create account', sub: 'Start your voice banking journey' },
    confirm: { heading: 'Check your email', sub: `We sent a verification code to ${email}` },
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1C1C1E' }}>
      <header
        className="px-6 h-16 flex items-center flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <AudioWaveform size={20} style={{ color: '#00C9A7' }} />
          <span style={{ fontWeight: 500, fontSize: 18, color: '#FFFFFF' }}>Kural</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 style={{ fontSize: 26, fontWeight: 500, color: '#FFFFFF', marginBottom: 8 }}>
              {titles[mode].heading}
            </h1>
            <p style={{ color: '#8E8E93', fontSize: 15 }}>{titles[mode].sub}</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{
                background: 'rgba(255,69,58,0.12)',
                border: '1px solid rgba(255,69,58,0.25)',
                color: '#FF453A',
              }}
            >
              {error}
            </motion.div>
          )}

          {/* ── Sign-in form ── */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#8E8E93', marginBottom: 6 }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={iconStyle} />
                  <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#8E8E93', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={iconStyle} />
                  <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ ...inputStyle, paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#636366', padding: 0 }} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div style={{ paddingTop: 4 }}>
                <button type="submit" disabled={submitting} style={btnPrimary}>
                  {submitting ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
              <p className="text-center" style={{ fontSize: 14, color: '#8E8E93' }}>
                No account?{' '}
                <Link href="/onboard" style={{ color: '#00C9A7', textDecoration: 'none', fontSize: 14 }}>Create one</Link>
              </p>
            </form>
          )}

          {/* ── Sign-up form ── */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#8E8E93', marginBottom: 6 }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={iconStyle} />
                  <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#8E8E93', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={iconStyle} />
                  <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8} style={{ ...inputStyle, paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#636366', padding: 0 }} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#8E8E93', marginBottom: 6 }}>Confirm password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={iconStyle} />
                  <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" required style={inputStyle} />
                </div>
              </div>
              <div style={{ paddingTop: 4 }}>
                <button type="submit" disabled={submitting} style={btnPrimary}>
                  {submitting ? 'Creating account…' : 'Create account'}
                </button>
              </div>
              <p className="text-center" style={{ fontSize: 14, color: '#8E8E93' }}>
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('signin')} style={btnLink}>Sign in</button>
              </p>
            </form>
          )}

          {/* ── Confirm form ── */}
          {mode === 'confirm' && (
            <form onSubmit={handleConfirm} className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#8E8E93', marginBottom: 6 }}>Verification code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  required
                  style={{ ...inputStyle, paddingLeft: 16, letterSpacing: 6, textAlign: 'center' }}
                />
              </div>
              <div style={{ paddingTop: 4 }}>
                <button type="submit" disabled={submitting} style={btnPrimary}>
                  {submitting ? 'Verifying…' : 'Verify & sign in'}
                </button>
              </div>
              <p className="text-center" style={{ fontSize: 14, color: '#8E8E93' }}>
                Wrong email?{' '}
                <button type="button" onClick={() => switchMode('signup')} style={btnLink}>Go back</button>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
