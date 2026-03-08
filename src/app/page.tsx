'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAppStore();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.type === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/chats');
      }
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, currentUser, router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      flexDirection: 'column',
      gap: '20px',
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '16px',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        boxShadow: 'var(--shadow-glow)',
        animation: 'glow-pulse 2s ease-in-out infinite',
      }}>
        💬
      </div>
      <div style={{
        width: '40px',
        height: '3px',
        borderRadius: '3px',
        background: 'var(--gradient-primary)',
        animation: 'shimmer 1.5s infinite',
        backgroundSize: '200% 100%',
      }} />
    </div>
  );
}
