'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { LayoutDashboard, Users, Bell, Activity, LogOut, Shield } from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/requests', label: 'Requests', icon: Bell },
  { href: '/admin/activity', label: 'Activity', icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthenticated, logout } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated || currentUser?.type !== 'admin') {
      router.replace('/login');
    }
  }, [isAuthenticated, currentUser, router]);

  if (!isAuthenticated || currentUser?.type !== 'admin') return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div style={{
        width: '240px', minWidth: '240px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column',
        padding: '24px 16px',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '16px' }}>Chatify</div>
            <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>Admin Panel</div>
          </div>
        </div>

        {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 14px', borderRadius: '12px', marginBottom: '4px',
              textDecoration: 'none', fontSize: '14px', fontWeight: active ? 600 : 400,
              background: active ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
              color: active ? '#f59e0b' : 'var(--text-secondary)',
              borderLeft: active ? '3px solid #f59e0b' : '3px solid transparent',
              transition: 'all 0.2s',
            }}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}

        <div style={{ flex: 1 }} />

        <button onClick={() => { logout(); router.push('/login'); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '11px 14px', borderRadius: '12px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '14px', width: '100%', textAlign: 'left',
          }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
        {children}
      </div>
    </div>
  );
}
