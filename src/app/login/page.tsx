'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle, Fingerprint, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<'email' | 'password' | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const result = login(email, password);

    if (result === 'error') {
      setError('Invalid email or password. Try priya@chatify.io / demo123');
      setLoading(false);
      return;
    }

    if (result === 'needs-otp') {
      router.push('/verify');
      return;
    }

    router.push('/chats');
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
      {/* Mesh background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(at 20% 30%, rgba(124,58,237,0.12) 0%, transparent 50%), radial-gradient(at 80% 70%, rgba(59,130,246,0.08) 0%, transparent 40%), radial-gradient(at 50% 0%, rgba(236,72,153,0.06) 0%, transparent 40%)',
        pointerEvents: 'none',
      }} />

      {/* Animated orb top-left */}
      <div style={{
        position: 'absolute', top: '-120px', left: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(109,40,217,0.2) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite',
      }} />

      {/* Animated orb bottom-right */}
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-60px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '420px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Card */}
        <div style={{
          background: 'rgba(12, 17, 35, 0.9)',
          backdropFilter: 'blur(30px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '28px',
          padding: '44px 36px 36px',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
          animation: 'fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        }}>
          {/* Logo area */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '68px', height: '68px', borderRadius: '20px',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', margin: '0 auto 18px',
              boxShadow: '0 0 40px rgba(124,58,237,0.3), 0 0 80px rgba(124,58,237,0.1)',
              animation: 'glow-pulse 3s ease-in-out infinite',
              position: 'relative',
            }}>
              💬
              {/* Rotating ring */}
              <div style={{
                position: 'absolute', inset: '-4px',
                borderRadius: '24px',
                border: '1px solid transparent',
                borderTopColor: 'rgba(124,58,237,0.4)',
                animation: 'spin-slow 4s linear infinite',
              }} />
            </div>
            <h1 style={{
              fontSize: '26px', fontWeight: 700, marginBottom: '6px',
              letterSpacing: '-0.02em',
            }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
              Enter your workspace credentials to continue
            </p>
          </div>

          {/* Demo hints */}
          <div style={{
            background: 'rgba(124, 58, 237, 0.06)',
            border: '1px solid rgba(124, 58, 237, 0.12)',
            borderRadius: '14px', padding: '14px 16px',
            marginBottom: '28px', fontSize: '12px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '6px',
            }}>
              <Fingerprint size={13} style={{ color: 'var(--accent-violet)' }} />
              <span style={{ fontWeight: 600, color: 'var(--accent-violet)', fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Demo Accounts</span>
            </div>
            • priya@chatify.io / demo123 (normal user)
            <br />• admin@chatify.io / admin123 (admin)
            <br /><span style={{ color: '#f59e0b', fontWeight: 500 }}>New signup → OTP on 1st login → password from 3rd time</span>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div>
              <label style={{
                fontSize: '12px', color: focused === 'email' ? 'var(--accent-violet)' : 'var(--text-secondary)',
                marginBottom: '8px', display: 'block', fontWeight: 500,
                transition: 'color 0.3s', letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'email' ? 'var(--accent-violet)' : 'var(--text-muted)',
                  transition: 'color 0.3s',
                }} />
                <input
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: '42px', height: '48px' }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  required
                  id="login-email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{
                  fontSize: '12px', color: focused === 'password' ? 'var(--accent-violet)' : 'var(--text-secondary)',
                  fontWeight: 500, transition: 'color 0.3s',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>Password</label>
                <Link href="#" style={{ fontSize: '12px', color: 'var(--accent-violet)', textDecoration: 'none', fontWeight: 500 }}>
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'password' ? 'var(--accent-violet)' : 'var(--text-muted)',
                  transition: 'color 0.3s',
                }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  style={{ paddingLeft: '42px', paddingRight: '42px', height: '48px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  required
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex',
                    transition: 'color 0.3s',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '12px 14px', borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)',
                color: '#f87171', fontSize: '13px', lineHeight: 1.5,
                animation: 'fadeInUp 0.3s ease',
              }}>
                <AlertCircle size={16} style={{ marginTop: '1px', flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              id="login-btn"
              disabled={loading}
              style={{
                width: '100%', marginTop: '4px',
                opacity: loading ? 0.7 : 1,
                height: '48px', fontSize: '15px', fontWeight: 600,
                borderRadius: '14px',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin-slow 0.6s linear infinite',
                  }} />
                  Signing in...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Sign In <ChevronRight size={16} />
                </span>
              )}
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: '26px', fontSize: '14px', color: 'var(--text-secondary)',
          }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{
              color: 'var(--accent-violet)', fontWeight: 600, textDecoration: 'none',
              transition: 'color 0.3s',
            }}>
              Create an account
            </Link>
          </div>

          {/* Footer Row */}
          <div style={{
            marginTop: '24px', paddingTop: '18px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            color: 'var(--text-muted)', fontSize: '12px',
          }}>
            <Shield size={12} style={{ color: 'var(--accent-emerald)' }} />
            End-to-end encrypted with AES-256
          </div>
        </div>

        {/* Bottom links */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '20px',
          marginTop: '20px', fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.3s' }}>Privacy Policy</span>
          <span>•</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.3s' }}>Terms of Service</span>
          <span>•</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.3s' }}>Contact Support</span>
        </div>

        <div style={{
          textAlign: 'center', marginTop: '12px',
          fontSize: '10px', color: 'var(--text-muted)', opacity: 0.6,
        }}>
          © 2024 Chatify Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
