'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { MessageCircle, BookOpen, Tv2, Lock, Brain, Users, LogOut, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/chats', label: 'Chats', icon: MessageCircle },
  { href: '/friends', label: 'Friends', icon: Users },
  { href: '/stories', label: 'Stories', icon: BookOpen },
  { href: '/watch', label: 'Watch', icon: Tv2 },
  { href: '/vault', label: 'Vault', icon: Lock },
  { href: '/memories', label: 'Memories', icon: Brain },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, friendRequests } = useAppStore();

  const pendingRequestsCount = currentUser 
    ? friendRequests.filter(r => r.receiverId === currentUser.id && r.status === 'pending').length 
    : 0;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 'var(--nav-height)',
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      display: 'flex',
      alignItems: 'center',
      paddingInline: '24px',
      zIndex: 100,
      gap: '8px',
      boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
    }}>
      {/* Logo */}
      <Link href="/chats" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginRight: '28px' }}>
        <div style={{
          width: '38px', height: '38px',
          borderRadius: '12px',
          background: 'var(--gradient-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
          boxShadow: '0 0 25px rgba(124,58,237,0.25)',
          position: 'relative',
        }}>
          💬
          {/* Subtle rotating ring */}
          <div style={{
            position: 'absolute', inset: '-3px', borderRadius: '15px',
            border: '1px solid transparent', borderTopColor: 'rgba(124,58,237,0.3)',
            animation: 'spin-slow 6s linear infinite',
          }} />
        </div>
        <span style={{
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '18px',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
        }}>
          Chatify
        </span>
      </Link>

      {/* Nav Items */}
      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          const hasBadge = href === '/friends' && pendingRequestsCount > 0;
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: active ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
              color: active ? 'var(--accent-violet)' : 'var(--text-secondary)',
              fontWeight: active ? 600 : 400,
              fontSize: '14px',
              position: 'relative',
              boxShadow: active ? 'inset 0 0 20px rgba(124,58,237,0.05)' : 'none',
            }}>
              <Icon size={16} />
              <span className="desktop-only">{label}</span>
              {hasBadge && (
                <div style={{
                  position: active ? 'relative' : 'absolute', top: active ? 0 : '2px', right: active ? 'auto' : '6px',
                  minWidth: '18px', height: '18px', borderRadius: '9px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 700, color: 'white',
                  padding: '0 4px',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
                  animation: 'pulse-ring 2s ease-in-out infinite',
                }}>
                  {pendingRequestsCount}
                </div>
              )}
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
            padding: '7px 14px', borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245,158,11,0.15)',
            color: '#f59e0b', fontSize: '12px', fontWeight: 600,
            textDecoration: 'none', letterSpacing: '0.03em',
          }}>
            <Shield size={13} />
            Admin
          </Link>
        )}

        {/* User Avatar */}
        {currentUser && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '4px 8px 4px 4px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '17px', position: 'relative',
              boxShadow: '0 0 12px rgba(124,58,237,0.15)',
            }}>
              {currentUser.avatar}
              <div style={{
                position: 'absolute', bottom: '-1px', right: '-1px',
                width: '10px', height: '10px', borderRadius: '50%',
                background: currentUser.status === 'available' ? '#10b981' : '#475569',
                border: '2px solid rgba(5,8,15,0.9)',
                boxShadow: currentUser.status === 'available' ? '0 0 6px #10b981' : 'none',
              }} />
            </div>
            <div className="desktop-only">
              <div style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>{currentUser.username}</div>
              <div className={currentUser.status === 'available' ? 'status-available' : 'status-not-available'}
                style={{ fontSize: '10px' }}>
                {currentUser.status === 'available' ? '● Available' : '○ Not Available'}
              </div>
            </div>
          </div>
        )}

        <button onClick={handleLogout} style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
          cursor: 'pointer', color: 'var(--text-muted)', padding: '8px',
          borderRadius: '10px', display: 'flex', alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { currentUser, friendRequests } = useAppStore();

  const pendingRequestsCount = currentUser 
    ? friendRequests.filter(r => r.receiverId === currentUser.id && r.status === 'pending').length 
    : 0;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      height: '72px',
      background: 'rgba(5, 8, 15, 0.92)',
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingInline: '8px',
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      zIndex: 100,
      boxShadow: '0 -4px 30px rgba(0,0,0,0.3)',
    }}>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        const hasBadge = href === '/friends' && pendingRequestsCount > 0;
        return (
          <Link key={href} href={href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            padding: '8px 14px', borderRadius: '12px',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: active ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
            color: active ? 'var(--accent-violet)' : 'var(--text-muted)',
            position: 'relative'
          }}>
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: '10px', fontWeight: active ? 700 : 400, letterSpacing: '0.02em' }}>{label}</span>
            {active && (
              <div style={{
                position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)',
                width: '16px', height: '2px', borderRadius: '1px',
                background: 'var(--accent-violet)',
                boxShadow: '0 0 6px rgba(124,58,237,0.5)',
              }} />
            )}
            {hasBadge && (
              <div style={{
                position: 'absolute', top: '4px', right: '10px',
                minWidth: '16px', height: '16px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 700, color: 'white',
                padding: '0 3px',
                border: '2px solid rgba(5,8,15,0.9)',
                boxShadow: '0 0 6px rgba(239,68,68,0.4)',
              }}>
                {pendingRequestsCount}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
