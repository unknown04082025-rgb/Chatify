'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Mail, Shield, RefreshCw, CheckCircle } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const { verifyOTP, pendingEmail } = useAppStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resent, setResent] = useState(false);
  // Demo OTP display
  const [demoOtp] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1000));
    // Accept demo OTP or any 6-digit code
    const ok = verifyOTP(code);
    if (ok) {
      setSuccess(true);
      setTimeout(() => router.push('/chats'), 1500);
    } else {
      setError('Invalid OTP. Use the demo code shown above or any 6 digits.');
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCountdown(60);
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-100px', left: '-50px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '400px',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '40px',
        position: 'relative', zIndex: 1,
      }}>
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'glow-pulse 1s ease-in-out infinite',
            }}>
              <CheckCircle size={36} color="#10b981" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#10b981' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>
              Redirecting you to Chatify...
            </p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '2px solid rgba(6, 182, 212, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Mail size={28} color="#06b6d4" />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Check your email</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                We sent a 6-digit code to<br />
                <strong style={{ color: 'var(--accent-cyan)' }}>{pendingEmail || 'your email'}</strong>
              </p>
            </div>

            {/* Demo OTP Box */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px', padding: '12px 14px',
              marginBottom: '24px', fontSize: '13px', textAlign: 'center',
            }}>
              <div style={{ color: '#f59e0b', fontWeight: 600, marginBottom: '4px' }}>Demo OTP (simulated email)</div>
              <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '6px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                {demoOtp}
              </div>
            </div>

            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* OTP Inputs */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { refs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-box"
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    id={`otp-${idx}`}
                  />
                ))}
              </div>

              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#f87171', fontSize: '13px', textAlign: 'center',
                }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary" id="verify-btn" disabled={loading}
                style={{ width: '100%', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            {/* Resend */}
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
              {countdown > 0 ? (
                <span style={{ color: 'var(--text-muted)' }}>
                  Resend code in <strong style={{ color: 'var(--accent-violet)' }}>{countdown}s</strong>
                </span>
              ) : (
                <button onClick={handleResend} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--accent-violet)', fontWeight: 600, fontSize: '14px',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}>
                  <RefreshCw size={14} />
                  {resent ? 'Code resent!' : 'Resend OTP'}
                </button>
              )}
            </div>

            <div style={{
              marginTop: '24px', paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              color: 'var(--text-muted)', fontSize: '12px',
            }}>
              <Shield size={12} style={{ color: 'var(--accent-emerald)' }} />
              OTP expires in 10 minutes
            </div>
          </>
        )}
      </div>
    </div>
  );
}
