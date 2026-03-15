'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { TopNav, BottomNav } from '@/components/navigation/Nav';
import { CallOverlay } from '@/components/calls/CallOverlay';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !currentUser) return null;

  return (
    <div className="min-h-screen relative">
      {/* Background Orbs */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        }} />
      </div>

      {/* Desktop: Top Nav */}
      <div className="desktop-only">
        <TopNav />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-[var(--nav-height)] min-h-screen main-content">
        {children}
      </main>

      {/* Mobile: Bottom Nav */}
      <div className="mobile-only">
        <BottomNav />
      </div>

      {/* Global Call Overlay */}
      <CallOverlay />
    </div>
  );
}
