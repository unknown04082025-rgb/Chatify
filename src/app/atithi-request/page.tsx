'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Mail, User, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AtithiRequestPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'var(--bg-card)', backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-color)', borderRadius: '24px',
        padding: '40px', position: 'relative', zIndex: 1,
      }}>
        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '2px solid rgba(245, 158, 11, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: '40px',
            }}>⭐</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700 }}>Request Submitted!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '10px', lineHeight: 1.6 }}>
              Your Atithi access request has been sent to the admin.<br />
              You&apos;ll be notified once approved.
            </p>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              marginTop: '24px', padding: '12px 24px',
              background: 'var(--gradient-primary)', color: 'white',
              borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '14px',
            }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <Link href="/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none',
                marginBottom: '20px',
              }}>
                <ArrowLeft size={14} /> Back to Signup
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Star size={22} color="#f59e0b" fill="#f59e0b" />
                </div>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Atithi Access Request</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Exclusive membership</p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(245, 158, 11, 0.07)',
              border: '1px solid rgba(245, 158, 11, 0.15)',
              borderRadius: '12px', padding: '14px',
              fontSize: '13px', color: 'var(--text-secondary)',
              marginBottom: '24px', lineHeight: 1.6,
            }}>
              ✨ <strong style={{ color: '#f59e0b' }}>Exclusive Atithi</strong> users are hidden from public search and friend suggestions. Admin approval required.
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="email" className="input-field" style={{ paddingLeft: '40px' }}
                    placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required id="atithi-email" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Desired Username</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" className="input-field" style={{ paddingLeft: '40px' }}
                    placeholder="exclusive_username" value={username} onChange={e => setUsername(e.target.value)} required id="atithi-username" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Reason for Access</label>
                <textarea className="input-field" rows={4}
                  style={{ resize: 'none', lineHeight: 1.5 }}
                  placeholder="Tell us why you'd like Atithi access..."
                  value={reason} onChange={e => setReason(e.target.value)} required id="atithi-reason" />
              </div>

              <button type="submit" className="btn-primary" id="atithi-submit" disabled={loading}
                style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b, #ec4899)', opacity: loading ? 0.7 : 1 }}>
                <Star size={15} /> {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
