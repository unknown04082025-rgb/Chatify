'use client';
import { useState } from 'react';
import { MOCK_ATITHI_REQUESTS } from '@/lib/mock-data';
import { Shield, Check, X } from 'lucide-react';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState(MOCK_ATITHI_REQUESTS);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Atithi Requests</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Approve or reject exclusive access requests</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {requests.map(req => (
          <div key={req.id} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px',
            position: 'relative', overflow: 'hidden',
          }}>
            {req.status !== 'pending' && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(10,14,26,0.8)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
              }}>
                <div style={{
                  padding: '8px 16px', borderRadius: '12px', fontWeight: 600,
                  background: req.status === 'approved' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                  color: req.status === 'approved' ? '#10b981' : '#f87171', border: `1px solid ${req.status === 'approved' ? '#10b981' : '#f87171'}`,
                }}>
                  {req.status.toUpperCase()}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{req.username}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{req.email}</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-glass)', borderRadius: '12px', padding: '14px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '20px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block', marginBottom: '6px' }}>REASON</span>
              "{req.reason}"
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleAction(req.id, 'rejected')} style={{
                flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px',
              }}>
                <X size={15} /> Reject
              </button>
              <button onClick={() => handleAction(req.id, 'approved')} style={{
                flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px',
              }}>
                <Check size={15} /> Approve
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <Shield size={40} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <div style={{ fontSize: '16px', fontWeight: 600 }}>No pending requests</div>
            <div style={{ fontSize: '14px', marginTop: '4px' }}>All Atithi requests have been processed.</div>
          </div>
        )}
      </div>
    </div>
  );
}
