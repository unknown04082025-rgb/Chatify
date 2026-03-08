'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Eye, EyeOff, Mail, User, Lock, Shield, ChevronRight, ChevronLeft, Star } from 'lucide-react';

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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* BG Orbs */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '460px',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '40px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', margin: '0 auto 12px',
            boxShadow: 'var(--shadow-glow)',
          }}>💬</div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Create your account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            Join Chatify — Step {step} of 3
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[1,2,3].map((s) => (
            <div key={s} style={{
              flex: 1, height: '4px', borderRadius: '4px',
              background: s <= step ? 'var(--gradient-primary)' : 'var(--border-color)',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>

        {/* Step 1: Type + Credentials */}
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
                    padding: '16px 12px',
                    borderRadius: '14px',
                    border: `2px solid ${userType === value ? 'var(--accent-violet)' : 'var(--border-color)'}`,
                    background: userType === value ? 'rgba(124,58,237,0.1)' : 'var(--bg-glass)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>
                </button>
              ))}
            </div>

            {userType === 'normal' && (
              <>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="email" className="input-field" style={{ paddingLeft: '40px' }}
                      placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required id="signup-email" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type={showPass ? 'text' : 'password'} className="input-field" style={{ paddingLeft: '40px', paddingRight: '42px' }}
                      placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required id="signup-password" />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn-primary" id="signup-next-1" style={{ width: '100%' }}>
              {userType === 'atithi' ? <><Star size={15} /> Request Atithi Access</> : <><ChevronRight size={15} /> Continue</>}
            </button>
          </form>
        )}

        {/* Step 2: Profile */}
        {step === 2 && (
          <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" className="input-field" style={{ paddingLeft: '40px' }}
                  placeholder="unique_username" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g,''))} required id="signup-username" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Display Name</label>
              <input type="text" className="input-field"
                placeholder="Your Name" value={displayName} onChange={e => setDisplayName(e.target.value)} required id="signup-display-name" />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', display: 'block' }}>
                Choose Avatar <span style={{ fontSize: '11px', color: 'var(--accent-violet)' }}>— permanent, cannot be changed</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {AVATARS.map((a) => (
                  <button key={a} type="button" onClick={() => setAvatar(a)}
                    style={{
                      width: '44px', height: '44px', borderRadius: '12px', fontSize: '22px',
                      border: `2px solid ${avatar === a ? 'var(--accent-violet)' : 'var(--border-color)'}`,
                      background: avatar === a ? 'rgba(124,58,237,0.15)' : 'var(--bg-glass)',
                      cursor: 'pointer', transition: 'all 0.2s',
                      transform: avatar === a ? 'scale(1.1)' : 'scale(1)',
                    }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn-ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>
                <ChevronLeft size={15} /> Back
              </button>
              <button type="submit" className="btn-primary" id="signup-next-2" style={{ flex: 2 }}>
                <ChevronRight size={15} /> Continue
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '40px', margin: '0 auto 16px',
                boxShadow: 'var(--shadow-glow)',
              }}>{avatar}</div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{displayName}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>@{username}</div>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '12px', padding: '14px',
              fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6,
            }}>
              <div style={{ color: '#10b981', fontWeight: 600, marginBottom: '6px' }}>🔐 Your account is protected</div>
              • Email verification OTP will be sent on your first login<br />
              • All your messages are end-to-end encrypted<br />
              • Avatar is permanent (cannot be changed later)
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn-ghost" onClick={() => setStep(2)} style={{ flex: 1 }}>
                <ChevronLeft size={15} /> Back
              </button>
              <button type="submit" className="btn-primary" id="signup-submit" style={{ flex: 2 }} disabled={loading}>
                {loading ? 'Creating Account...' : '🎉 Create Account'}
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
          borderTop: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          color: 'var(--text-muted)', fontSize: '12px',
        }}>
          <Shield size={12} style={{ color: 'var(--accent-emerald)' }} />
          End-to-end encrypted with AES-256 + RSA-OAEP
        </div>
      </div>
    </div>
  );
}
