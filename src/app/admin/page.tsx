'use client';
import Link from 'next/link';
import { MOCK_USERS, MOCK_ATITHI_REQUESTS, MOCK_LOGIN_ACTIVITY } from '@/lib/mock-data';
import { Users, Bell, Activity, Shield, TrendingUp, Circle, MonitorSmartphone, CheckCircle, Server, Zap, BarChart3 } from 'lucide-react';

function StatCard({ label, value, icon, color, trend }: {
  label: string; value: string | number; icon: React.ReactNode; color: string; trend?: string;
}) {
  return (
    <div className="stat-card card-glow" style={{ position: 'relative' }}>
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${color}, ${color}00)`,
        borderRadius: '16px 16px 0 0',
      }} />
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '0 16px 0 80px',
        background: `${color}08`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '12px',
          background: `${color}10`, border: `1px solid ${color}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 15px ${color}10`,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{
        fontSize: '32px', fontWeight: 800, fontFamily: 'Space Grotesk', letterSpacing: '-0.02em',
        background: `linear-gradient(135deg, ${color}, ${color}aa)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>{value}</div>
      {trend && <div style={{ fontSize: '12px', color: '#10b981', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <TrendingUp size={12} /> {trend}
      </div>}
    </div>
  );
}

export default function AdminDashboard() {
  const onlineUsers = MOCK_USERS.filter(u => u.status === 'available');
  const pendingRequests = MOCK_ATITHI_REQUESTS.filter(r => r.status === 'pending');
  const normalUsers = MOCK_USERS.filter(u => u.type === 'normal');
  const atithiUsers = MOCK_USERS.filter(u => u.type === 'atithi');

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease forwards' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(124,58,237,0.3)',
          }}>
            <BarChart3 size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              <span style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Admin</span> Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Real-time monitoring and administrative management</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Users" value={MOCK_USERS.filter(u => u.type !== 'admin').length} icon={<Users size={18} color="#7c3aed" />} color="#7c3aed" trend="↑ 2 this week" />
        <StatCard label="Online Now" value={onlineUsers.length} icon={<Circle size={18} color="#10b981" fill="#10b981" />} color="#10b981" />
        <StatCard label="Pending Requests" value={pendingRequests.length} icon={<Bell size={18} color="#f59e0b" />} color="#f59e0b" trend="Needs attention" />
        <StatCard label="Atithi Members" value={atithiUsers.length} icon={<Shield size={18} color="#ec4899" />} color="#ec4899" />
      </div>

      {/* System Health + Online Users */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* System Health */}
        <div style={{
          background: 'rgba(12,17,35,0.8)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '18px', padding: '24px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          <div style={{
            fontSize: '14px', fontWeight: 600, marginBottom: '18px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'rgba(124,58,237,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Server size={14} style={{ color: 'var(--accent-violet)' }} />
            </div>
            System Health
          </div>
          {[
            { label: 'Encryption Status', value: 'AES-256 Active', ok: true },
            { label: 'WebSocket Server', value: 'Connected', ok: true },
            { label: 'Vault Storage', value: 'Encrypted', ok: true },
            { label: 'OTP Service', value: 'Operational', ok: true },
            { label: 'Server Latency', value: '24ms', ok: true },
          ].map(({ label, value, ok }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '12px', padding: '8px 10px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
              <span style={{
                fontSize: '12px', color: ok ? '#10b981' : '#ef4444',
                display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500,
              }}>
                <CheckCircle size={12} /> {value}
              </span>
            </div>
          ))}
        </div>

        {/* Online Users */}
        <div style={{
          background: 'rgba(12,17,35,0.8)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '18px', padding: '24px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          <div style={{
            fontSize: '14px', fontWeight: 600, marginBottom: '18px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'rgba(16,185,129,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={14} style={{ color: '#10b981' }} />
            </div>
            Online Users
          </div>
          {onlineUsers.map(user => (
            <div key={user.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '12px', padding: '8px 10px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                boxShadow: '0 0 10px rgba(124,58,237,0.2)',
              }}>
                {user.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{user.username}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.device}</div>
              </div>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%', background: '#10b981',
                boxShadow: '0 0 6px #10b981',
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/admin/requests" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '14px 20px', borderRadius: '14px',
          background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.12)',
          color: '#f59e0b', fontWeight: 600, fontSize: '13px', textDecoration: 'none',
          transition: 'all 0.3s',
          boxShadow: '0 0 15px rgba(245,158,11,0.05)',
        }}>
          <Bell size={15} /> Review {pendingRequests.length} Pending Requests
        </Link>
        <Link href="/admin/activity" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '14px 20px', borderRadius: '14px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px', textDecoration: 'none',
          transition: 'all 0.3s',
        }}>
          <Activity size={15} /> View Activity Log
        </Link>
      </div>
    </div>
  );
}
