'use client';
import { useState } from 'react';
import { MOCK_USERS } from '@/lib/mock-data';
import { Search } from 'lucide-react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_USERS.filter(u =>
    u.username.includes(search) || u.email.includes(search) || u.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Users Directory</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Manage all registered accounts</p>
        </div>
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="input-field" style={{ paddingLeft: '36px', fontSize: '13px' }}
            placeholder="Search username, email..." value={search} onChange={e => setSearch(e.target.value)} id="admin-user-search" />
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>User</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Joined</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>Device</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{u.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.displayName}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                    background: u.type === 'admin' ? 'rgba(245,158,11,0.1)' : u.type === 'atithi' ? 'rgba(236,72,153,0.1)' : 'var(--bg-glass)',
                    color: u.type === 'admin' ? '#f59e0b' : u.type === 'atithi' ? '#ec4899' : 'var(--text-secondary)',
                  }}>{u.type.toUpperCase()}</span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: u.status === 'available' ? '#10b981' : 'var(--text-muted)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.status === 'available' ? '#10b981' : 'var(--text-muted)' }} />
                    {u.status === 'available' ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{u.joinedDate}</td>
                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{u.device || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
