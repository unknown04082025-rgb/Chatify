'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Eye, EyeOff, Mail, User, Lock, Shield, ChevronRight, ChevronLeft, Star, Sparkles } from 'lucide-react';

const AVATARS = ['😎', '🌸', '🔥', '✨', '🚀', '🎯', '💫', '🦋', '🌊', '⚡', '🎸', '🌺', '🦊', '🐬', '🎨'];

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAppStore();

  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'normal' | 'atithi'>('normal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('😎');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === 'atithi') {
      router.push('/atithi-request');
      return;
    }
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    signUp({ email, username, displayName, avatar, type: 'normal' }, password);
    router.push('/chats');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Mesh background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(at 80% 20%, rgba(236,72,153,0.12) 0%, transparent 50%), radial-gradient(at 20% 80%, rgba(124,58,237,0.12) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      {/* Floating orbs */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)', animation: 'float 7s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-60px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)', animation: 'float 9s ease-in-out infinite reverse',
      }} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '460px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          background: 'rgba(12, 17, 35, 0.9)',
          backdropFilter: 'blur(30px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '28px', padding: '40px 36px 36px',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
          animation: 'fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'var(--gradient-purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', margin: '0 auto 14px',
              boxShadow: '0 0 40px rgba(236,72,153,0.2), 0 0 80px rgba(124,58,237,0.1)',
              animation: 'glow-pulse 3s ease-in-out infinite',
              position: 'relative',
            }}>
              💬
              <div style={{
                position: 'absolute', inset: '-4px', borderRadius: '22px',
                border: '1px solid transparent', borderTopColor: 'rgba(236,72,153,0.4)',
                animation: 'spin-slow 4s linear infinite',
              }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>Create your account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
              Join Chatify — Step {step} of 3
            </p>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
            {[1,2,3].map((s) => (
              <div key={s} style={{
                flex: 1, height: '3px', borderRadius: '3px',
                background: s <= step
                  ? 'linear-gradient(90deg, #7c3aed, #ec4899)'
                  : 'rgba(255,255,255,0.06)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: s <= step ? '0 0 8px rgba(124,58,237,0.3)' : 'none',
              }} />
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { value: 'normal', label: 'Normal User', desc: 'Join instantly', icon: '👤' },
                  { value: 'atithi', label: 'Atithi User', desc: 'Request access', icon: '⭐' },
                ].map(({ value, label, desc, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setUserType(value as 'normal' | 'atithi')}
                    style={{
                      padding: '18px 14px', borderRadius: '16px',
                      border: `2px solid ${userType === value ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.06)'}`,
                      background: userType === value
                        ? 'rgba(124,58,237,0.08)'
                        : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer', textAlign: 'center',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: userType === value ? '0 0 20px rgba(124,58,237,0.15)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{desc}</div>
                  </button>
                ))}
              </div>

              {userType === 'normal' && (
                <>
                  <div>
                    <label style={{
                      fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em',
                      textTransform: 'uppercase' as const,
                      color: focused === 'email' ? 'var(--accent-violet)' : 'var(--text-secondary)',
                      marginBottom: '8px', display: 'block', transition: 'color 0.3s',
                    }}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input type="email" className="input-field" style={{ paddingLeft: '40px', height: '48px' }}
                        placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} required id="signup-email" />
                    </div>
                  </div>
                  <div>
                    <label style={{
                      fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                      color: focused === 'password' ? 'var(--accent-violet)' : 'var(--text-secondary)',
                      marginBottom: '8px', display: 'block', transition: 'color 0.3s',
                    }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input type={showPass ? 'text' : 'password'} className="input-field" style={{ paddingLeft: '40px', paddingRight: '42px', height: '48px' }}
                        placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} required id="signup-password" />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="btn-primary" id="signup-next-1" style={{ width: '100%', height: '48px', borderRadius: '14px', fontSize: '15px' }}>
                {userType === 'atithi' ? <><Star size={15} /> Request Atithi Access</> : <>Continue <ChevronRight size={15} /></>}
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeInUp 0.4s ease' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" className="input-field" style={{ paddingLeft: '40px', height: '48px' }}
                    placeholder="unique_username" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g,''))} required id="signup-username" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Display Name</label>
                <input type="text" className="input-field" style={{ height: '48px' }}
                  placeholder="Your Name" value={displayName} onChange={e => setDisplayName(e.target.value)} required id="signup-display-name" />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: 'var(--text-secondary)', marginBottom: '10px', display: 'block' }}>
                  Choose Avatar <span style={{ color: 'var(--accent-violet)', fontSize: '10px', fontWeight: 400, textTransform: 'none' }}>— permanent, cannot be changed</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {AVATARS.map((a) => (
                    <button key={a} type="button" onClick={() => setAvatar(a)}
                      style={{
                        width: '44px', height: '44px', borderRadius: '12px', fontSize: '22px',
                        border: `2px solid ${avatar === a ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.06)'}`,
                        background: avatar === a ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: avatar === a ? 'scale(1.12)' : 'scale(1)',
                        boxShadow: avatar === a ? '0 0 15px rgba(124,58,237,0.2)' : 'none',
                      }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-ghost" onClick={() => setStep(1)} style={{ flex: 1, height: '48px', borderRadius: '14px' }}>
                  <ChevronLeft size={15} /> Back
                </button>
                <button type="submit" className="btn-primary" id="signup-next-2" style={{ flex: 2, height: '48px', borderRadius: '14px' }}>
                  Continue <ChevronRight size={15} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeInUp 0.4s ease' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '84px', height: '84px', borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '42px', margin: '0 auto 16px',
                  boxShadow: '0 0 40px rgba(124,58,237,0.3), 0 0 80px rgba(124,58,237,0.1)',
                  position: 'relative',
                }}>
                  {avatar}
                  <div style={{
                    position: 'absolute', inset: '-6px', borderRadius: '50%',
                    border: '2px solid transparent', borderTopColor: 'rgba(124,58,237,0.3)',
                    animation: 'spin-slow 3s linear infinite',
                  }} />
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700 }}>{displayName}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>@{username}</div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.12)',
                borderRadius: '14px', padding: '16px',
                fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6,
              }}>
                <div style={{ color: '#10b981', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} /> Your account is protected
                </div>
                • Email verification OTP will be sent on your first login<br />
                • All your messages are end-to-end encrypted<br />
                • Avatar is permanent (cannot be changed later)
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn-ghost" onClick={() => setStep(2)} style={{ flex: 1, height: '48px', borderRadius: '14px' }}>
                  <ChevronLeft size={15} /> Back
                </button>
                <button type="submit" className="btn-primary" id="signup-submit" style={{ flex: 2, height: '48px', borderRadius: '14px', fontSize: '15px' }} disabled={loading}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.6s linear infinite' }} />
                      Creating...
                    </span>
                  ) : '🎉 Create Account'}
                </button>
              </div>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent-violet)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>

          <div style={{
            marginTop: '20px', paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            color: 'var(--text-muted)', fontSize: '12px',
          }}>
            <Shield size={12} style={{ color: 'var(--accent-emerald)' }} />
            End-to-end encrypted with AES-256 + RSA-OAEP
          </div>
        </div>
      </div>
    </div>
  );
}
