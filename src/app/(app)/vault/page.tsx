'use client';
import { useState } from 'react';
import { MOCK_VAULT_ITEMS } from '@/lib/mock-data';
import { Lock, Unlock, Shield, Upload, Image, Video, Mic, Eye, EyeOff, Trash2, Lock as LockIcon, Fingerprint } from 'lucide-react';
import { useAppStore } from '@/lib/store';

function PinDot({ filled }: { filled: boolean }) {
  return (
    <div style={{
      width: '16px', height: '16px', borderRadius: '50%',
      background: filled ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.03)',
      border: `2px solid ${filled ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`,
      boxShadow: filled ? '0 0 12px rgba(124,58,237,0.4)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: filled ? 'scale(1.1)' : 'scale(1)',
    }} />
  );
}

export default function VaultPage() {
  const { vaultUnlocked, unlockVault, lockVault } = useAppStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  const handlePinPress = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        const ok = unlockVault(next);
        if (!ok) {
          setError('Incorrect PIN. Try 1234 for demo.');
          setShaking(true);
          setTimeout(() => { setShaking(false); setPin(''); setError(''); }, 800);
        }
      }, 200);
    }
  };

  if (!vaultUnlocked) {
    return (
      <div style={{
        minHeight: 'calc(100vh - var(--nav-height))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Mesh bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(at 50% 40%, rgba(124,58,237,0.12) 0%, transparent 50%), radial-gradient(at 30% 80%, rgba(236,72,153,0.08) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          background: 'rgba(12,17,35,0.9)', backdropFilter: 'blur(30px) saturate(160%)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '28px', padding: '52px 44px', maxWidth: '380px', width: '100%',
          position: 'relative', zIndex: 1, textAlign: 'center',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
          animation: 'fadeInUp 0.6s ease forwards',
        }}>
          {/* Vault Lock Icon */}
          <div className="vault-lock animate-glow" style={{
            width: '84px', height: '84px', margin: '0 auto 28px',
            position: 'relative',
          }}>
            <Lock size={36} color="white" />
            {/* Orbiting ring */}
            <div style={{
              position: 'absolute', inset: '-8px', borderRadius: '50%',
              border: '1px solid transparent', borderTopColor: 'rgba(124,58,237,0.3)',
              animation: 'spin-slow 4s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: '-16px', borderRadius: '50%',
              border: '1px solid transparent', borderBottomColor: 'rgba(236,72,153,0.2)',
              animation: 'spin-slow 6s linear infinite reverse',
            }} />
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>Vault</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '34px' }}>
            Enter your 4-digit PIN to unlock
          </p>

          {/* Pin dots */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '34px' }}>
            {[0,1,2,3].map((i) => <PinDot key={i} filled={i < pin.length} />)}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.12)',
              color: '#f87171', fontSize: '13px', marginBottom: '20px',
              animation: 'fadeInUp 0.3s ease',
            }}>
              {error}
            </div>
          )}

          {/* Numpad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', maxWidth: '230px', margin: '0 auto' }}>
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key) => (
              <button key={key}
                id={`pin-${key}`}
                onClick={() => {
                  if (key === '⌫') setPin(p => p.slice(0,-1));
                  else if (key !== '') handlePinPress(key);
                }}
                style={{
                  height: '56px', borderRadius: '14px',
                  background: key === '' ? 'transparent' : 'rgba(255,255,255,0.03)',
                  border: key === '' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  color: 'var(--text-primary)', fontSize: key === '⌫' ? '18px' : '20px',
                  fontWeight: 600, cursor: key === '' ? 'default' : 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontFamily: 'Space Grotesk',
                }}>
                {key}
              </button>
            ))}
          </div>

          <div style={{
            marginTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            color: 'var(--text-muted)', fontSize: '12px',
          }}>
            <Shield size={12} style={{ color: 'var(--accent-emerald)' }} />
            AES-256 encrypted storage
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto', animation: 'fadeInUp 0.5s ease forwards' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '14px',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 25px rgba(124,58,237,0.3)',
          }}>
            <Unlock size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em' }}>Vault</h1>
            <div className="encrypt-badge">AES-256 Encrypted</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button id="upload-vault-btn" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', background: 'var(--gradient-primary)',
            border: 'none', borderRadius: '12px', color: 'white',
            fontWeight: 600, fontSize: '13px', cursor: 'pointer',
            boxShadow: '0 0 20px rgba(124,58,237,0.2)',
          }}>
            <Upload size={15} /> Add to Vault
          </button>
          <button id="lock-vault-btn" onClick={lockVault}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px',
              transition: 'all 0.2s',
            }}>
            <LockIcon size={15} /> Lock
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.1)',
        borderRadius: '16px', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: '14px',
        marginBottom: '24px', fontSize: '13px', color: 'var(--text-secondary)',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px',
          background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Fingerprint size={16} style={{ color: 'var(--accent-violet)' }} />
        </div>
        Files are encrypted with AES-256-GCM on your device before upload. Server never sees plaintext.
        Vault is shared between you and 🌸 Priya Sharma.
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '22px' }}>
        {[
          { label: 'All', icon: null },
          { label: 'Photos', icon: <Image size={13} /> },
          { label: 'Videos', icon: <Video size={13} /> },
          { label: 'Voice Notes', icon: <Mic size={13} /> },
        ].map(({ label, icon }) => (
          <button key={label} id={`vault-tab-${label.toLowerCase()}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 500,
              background: label === 'All' ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${label === 'All' ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)'}`,
              color: label === 'All' ? 'var(--accent-violet)' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Files Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px' }}>
        {MOCK_VAULT_ITEMS.map((item) => (
          <div key={item.id} id={`vault-item-${item.id}`}
            style={{
              background: 'rgba(12,17,35,0.8)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px', overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4), 0 0 20px rgba(124,58,237,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04)'; }}>
            {/* Thumbnail */}
            <div style={{
              height: '130px',
              background: item.type === 'image'
                ? 'linear-gradient(135deg, #4c1d95, #1e3a8a)'
                : item.type === 'video'
                  ? 'linear-gradient(135deg, #1e3a8a, #0f766e)'
                  : 'linear-gradient(135deg, #27272a, #18181b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px',
              position: 'relative',
            }}>
              {item.type === 'image' ? '🖼️' : item.type === 'video' ? '🎬' : '🎤'}
              <div style={{
                position: 'absolute', top: '10px', right: '10px',
                padding: '3px 8px', borderRadius: '6px', fontSize: '10px',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                color: 'var(--accent-emerald)', fontWeight: 600,
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
                🔒
              </div>
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.size}</span>
                <span style={{
                  padding: '1px 6px', borderRadius: '4px', fontSize: '10px',
                  background: 'rgba(255,255,255,0.04)',
                }}>{item.type}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Upload Placeholder */}
        <div style={{
          background: 'rgba(255,255,255,0.01)',
          border: '2px dashed rgba(255,255,255,0.08)',
          borderRadius: '16px', height: '200px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '10px', cursor: 'pointer', color: 'var(--text-muted)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent-violet)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
          <Upload size={24} />
          <span style={{ fontSize: '13px' }}>Upload & Encrypt</span>
        </div>
      </div>
    </div>
  );
}
