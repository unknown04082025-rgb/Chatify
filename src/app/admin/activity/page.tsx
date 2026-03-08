'use client';
import { MOCK_LOGIN_ACTIVITY, MOCK_USERS } from '@/lib/mock-data';
import { Activity, LogIn, LogOut, KeyRound, CheckCircle2, MonitorSmartphone } from 'lucide-react';
import { formatRelativeTime } from '@/lib/crypto';

export default function AdminActivityPage() {
  const getIcon = (action: string) => {
    switch (action) {
      case 'login': return <LogIn size={14} color="#10b981" />;
      case 'logout': return <LogOut size={14} color="#f87171" />;
      case 'otp-sent': return <KeyRound size={14} color="#f59e0b" />;
      case 'otp-verified': return <CheckCircle2 size={14} color="#3b82f6" />;
      default: return <Activity size={14} color="var(--text-muted)" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'login': return 'Logged in';
      case 'logout': return 'Logged out';
      case 'otp-sent': return 'OTP Sent to email';
      case 'otp-verified': return 'OTP Verified successfully';
      default: return action;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>System Activity Log</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Monitor authentication, OTPs, and user sessions</p>
        </div>
        <div style={{ padding: '8px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Last 24 hours
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ position: 'relative' }}>
          {/* Vertical Timeline Line */}
          <div style={{ position: 'absolute', left: '23px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border-color)', zIndex: 0 }} />

          {MOCK_LOGIN_ACTIVITY.map((log) => {
            const user = MOCK_USERS.find(u => u.id === log.userId);
            return (
              <div key={log.id} style={{ display: 'flex', gap: '20px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                {/* Icon Timeline Node */}
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'var(--bg-primary)', border: '2px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {getIcon(log.action)}
                </div>

                {/* Log Content */}
                <div style={{
                  flex: 1, background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                  borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{user?.avatar}</span>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{log.username}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {getActionText(log.action)}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {formatRelativeTime(log.timestamp)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MonitorSmartphone size={12} /> {log.device}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      🌐 IP: {log.ip}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
