'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { MessageCircle, BookOpen, Tv2, Lock, Brain, Settings, LogOut, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/chats', label: 'Chats', icon: MessageCircle },
  { href: '/stories', label: 'Stories', icon: BookOpen },
  { href: '/watch', label: 'Watch', icon: Tv2 },
  { href: '/vault', label: 'Vault', icon: Lock },
  { href: '/memories', label: 'Memories', icon: Brain },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 'var(--nav-height)',
      background: 'rgba(10, 14, 26, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      paddingInline: '24px',
      zIndex: 100,
      gap: '8px',
    }}>
      {/* Logo */}
      <Link href="/chats" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginRight: '24px' }}>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '10px',
          background: 'var(--gradient-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
          boxShadow: 'var(--shadow-glow)',
        }}>
          💬
        </div>
        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>
          Chatify
        </span>
      </Link>

      {/* Nav Items */}
      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              background: active ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
              color: active ? 'var(--accent-violet)' : 'var(--text-secondary)',
              fontWeight: active ? 600 : 400,
              fontSize: '14px',
            }}>
              <Icon size={16} />
              <span className="desktop-only">{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right: User + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Encrypt Badge */}
        <div className="encrypt-badge" style={{ padding: '4px 10px' }}>
          🔒 E2E Encrypted
        </div>

        {currentUser?.type === 'admin' && (
          <Link href="/admin" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 12px', borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b', fontSize: '13px', fontWeight: 600,
            textDecoration: 'none',
          }}>
            <Shield size={14} />
            Admin
          </Link>
        )}

        {/* User Avatar */}
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', position: 'relative',
            }}>
              {currentUser.avatar}
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '10px', height: '10px', borderRadius: '50%',
                background: currentUser.status === 'available' ? '#10b981' : '#475569',
                border: '2px solid var(--bg-primary)',
              }} />
            </div>
            <div className="desktop-only">
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{currentUser.username}</div>
              <div className={currentUser.status === 'available' ? 'status-available' : 'status-not-available'}
                style={{ fontSize: '11px' }}>
                {currentUser.status === 'available' ? '● Available' : '○ Not Available'}
              </div>
            </div>
          </div>
        )}

        <button onClick={handleLogout} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', padding: '8px', borderRadius: '8px',
          display: 'flex', alignItems: 'center',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      height: '72px',
      background: 'rgba(10, 14, 26, 0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingInline: '8px',
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      zIndex: 100,
    }}>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            padding: '8px 16px', borderRadius: '12px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            background: active ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
            color: active ? 'var(--accent-violet)' : 'var(--text-muted)',
          }}>
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: '10px', fontWeight: active ? 700 : 400 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
