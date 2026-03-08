'use client';
import Link from 'next/link';
import { MOCK_USERS, MOCK_ATITHI_REQUESTS, MOCK_LOGIN_ACTIVITY } from '@/lib/mock-data';
import { Users, Bell, Activity, Shield, TrendingUp, Circle, MonitorSmartphone, CheckCircle } from 'lucide-react';

function StatCard({ label, value, icon, color, trend }: {
  label: string; value: string | number; icon: React.ReactNode; color: string; trend?: string;
}) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '22px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '0 16px 0 80px',
        background: `${color}15`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}20`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <div style={{ fontSize: '30px', fontWeight: 800, fontFamily: 'Space Grotesk' }}>{value}</div>
      {trend && <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>{trend}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const onlineUsers = MOCK_USERS.filter(u => u.status === 'available');
  const pendingRequests = MOCK_ATITHI_REQUESTS.filter(r => r.status === 'pending');
  const normalUsers = MOCK_USERS.filter(u => u.type === 'normal');
  const atithiUsers = MOCK_USERS.filter(u => u.type === 'atithi');

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>System overview and monitoring</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Total Users" value={MOCK_USERS.filter(u => u.type !== 'admin').length} icon={<Users size={18} color="#7c3aed" />} color="#7c3aed" trend="↑ 2 this week" />
        <StatCard label="Online Now" value={onlineUsers.length} icon={<Circle size={18} color="#10b981" fill="#10b981" />} color="#10b981" />
        <StatCard label="Pending Requests" value={pendingRequests.length} icon={<Bell size={18} color="#f59e0b" />} color="#f59e0b" trend="Needs attention" />
        <StatCard label="Atithi Members" value={atithiUsers.length} icon={<Shield size={18} color="#ec4899" />} color="#ec4899" />
      </div>

      {/* System Health */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '22px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} style={{ color: 'var(--accent-violet)' }} /> System Health
          </div>
          {[
            { label: 'Encryption Status', value: 'AES-256 Active', ok: true },
            { label: 'WebSocket Server', value: 'Connected', ok: true },
            { label: 'Vault Storage', value: 'Encrypted', ok: true },
            { label: 'OTP Service', value: 'Operational', ok: true },
          ].map(({ label, value, ok }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
              <span style={{ fontSize: '12px', color: ok ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={12} /> {value}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '22px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} style={{ color: 'var(--accent-violet)' }} /> Online Users
          </div>
          {onlineUsers.map(user => (
            <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                {user.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{user.username}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.device}</div>
              </div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link href="/admin/requests" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px 18px', borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)',
          color: '#f59e0b', fontWeight: 600, fontSize: '13px', textDecoration: 'none',
        }}>
          <Bell size={15} /> Review {pendingRequests.length} Pending Requests
        </Link>
        <Link href="/admin/activity" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '12px 18px', borderRadius: '12px',
          background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px', textDecoration: 'none',
        }}>
          <Activity size={15} /> View Activity Log
        </Link>
      </div>
    </div>
  );
}
