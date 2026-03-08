'use client';
import { useState } from 'react';
import { MOCK_VAULT_ITEMS } from '@/lib/mock-data';
import { Lock, Unlock, Shield, Upload, Image, Video, Mic, Eye, EyeOff, Trash2, Lock as LockIcon } from 'lucide-react';
import { useAppStore } from '@/lib/store';

function PinDot({ filled }: { filled: boolean }) {
  return (
    <div style={{
      width: '14px', height: '14px', borderRadius: '50%',
      background: filled ? 'var(--gradient-primary)' : 'var(--bg-glass)',
      border: `2px solid ${filled ? 'var(--accent-violet)' : 'var(--border-color)'}`,
      boxShadow: filled ? '0 0 8px rgba(124,58,237,0.4)' : 'none',
      transition: 'all 0.3s',
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
        {/* Purple glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)',
          borderRadius: '28px', padding: '48px 40px', maxWidth: '360px', width: '100%',
          position: 'relative', zIndex: 1, textAlign: 'center',
          animation: shaking ? 'none' : undefined,
          transform: shaking ? 'translateX(0)' : undefined,
        }}>
          {/* Vault Lock Icon */}
          <div className="vault-lock animate-glow" style={{
            width: '80px', height: '80px', margin: '0 auto 24px',
          }}>
            <Lock size={36} color="white" />
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Vault</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>
            Enter your 4-digit PIN to unlock
          </p>

          {/* Pin dots */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
            {[0,1,2,3].map((i) => <PinDot key={i} filled={i < pin.length} />)}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '8px 14px', borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171', fontSize: '13px', marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {/* Numpad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '220px', margin: '0 auto' }}>
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key) => (
              <button key={key}
                id={`pin-${key}`}
                onClick={() => {
                  if (key === '⌫') setPin(p => p.slice(0,-1));
                  else if (key !== '') handlePinPress(key);
                }}
                style={{
                  height: '52px', borderRadius: '14px',
                  background: key === '' ? 'transparent' : 'var(--bg-glass)',
                  border: key === '' ? 'none' : '1px solid var(--border-color)',
                  color: 'var(--text-primary)', fontSize: key === '⌫' ? '18px' : '20px',
                  fontWeight: 600, cursor: key === '' ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (key !== '') e.currentTarget.style.background = 'var(--bg-glass-hover)'; }}
                onMouseLeave={e => { if (key !== '') e.currentTarget.style.background = 'var(--bg-glass)'; }}>
                {key}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <Shield size={12} style={{ color: 'var(--accent-emerald)' }} />
            AES-256 encrypted storage
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Unlock size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Vault</h1>
            <div className="encrypt-badge">AES-256 Encrypted</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button id="upload-vault-btn" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px', background: 'var(--gradient-primary)',
            border: 'none', borderRadius: '12px', color: 'white',
            fontWeight: 600, fontSize: '13px', cursor: 'pointer',
          }}>
            <Upload size={15} /> Add to Vault
          </button>
          <button id="lock-vault-btn" onClick={lockVault}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}>
            <LockIcon size={15} /> Lock
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)',
        borderRadius: '14px', padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '24px', fontSize: '13px', color: 'var(--text-secondary)',
      }}>
        <Shield size={18} style={{ color: 'var(--accent-violet)', flexShrink: 0 }} />
        Files are encrypted with AES-256-GCM on your device before upload. Server never sees plaintext.
        Vault is shared between you and 🌸 Priya Sharma.
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { label: 'All', icon: null },
          { label: 'Photos', icon: <Image size={13} /> },
          { label: 'Videos', icon: <Video size={13} /> },
          { label: 'Voice Notes', icon: <Mic size={13} /> },
        ].map(({ label, icon }) => (
          <button key={label} id={`vault-tab-${label.toLowerCase()}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '10px', fontSize: '13px',
              background: label === 'All' ? 'rgba(124,58,237,0.15)' : 'var(--bg-glass)',
              border: `1px solid ${label === 'All' ? 'var(--accent-violet)' : 'var(--border-color)'}`,
              color: label === 'All' ? 'var(--accent-violet)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}>
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Files Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
        {MOCK_VAULT_ITEMS.map((item) => (
          <div key={item.id} id={`vault-item-${item.id}`}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: '16px', overflow: 'hidden',
              transition: 'all 0.3s', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-violet)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}>
            {/* Thumbnail */}
            <div style={{
              height: '120px',
              background: item.type === 'image'
                ? 'linear-gradient(135deg, #4c1d95, #1e3a8a)'
                : item.type === 'video'
                  ? 'linear-gradient(135deg, #1e3a8a, #0f766e)'
                  : 'linear-gradient(135deg, #3f3f46, #27272a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
              position: 'relative',
            }}>
              {item.type === 'image' ? '🖼️' : item.type === 'video' ? '🎬' : '🎤'}
              <div style={{
                position: 'absolute', top: '8px', right: '8px',
              }} className="encrypt-badge">
                🔒
              </div>
            </div>
            <div style={{ padding: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.size}</span>
                <span>{item.type}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Upload Placeholder */}
        <div style={{
          background: 'var(--bg-glass)', border: '2px dashed var(--border-color)',
          borderRadius: '16px', height: '180px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '10px', cursor: 'pointer', color: 'var(--text-muted)',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-violet)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent-violet)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
          <Upload size={24} />
          <span style={{ fontSize: '13px' }}>Upload & Encrypt</span>
        </div>
      </div>
    </div>
  );
}
