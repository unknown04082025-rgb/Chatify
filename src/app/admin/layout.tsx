'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MOCK_ATITHI_REQUESTS } from '@/lib/mock-data';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/requests', label: 'Approvals', icon: 'verified_user', badge: true },
  { href: '/admin/activity', label: 'Activity', icon: 'analytics' },
  { href: '/admin/users', label: 'System Health', icon: 'monitor_heart' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthenticated, logout } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  const pendingRequests = MOCK_ATITHI_REQUESTS.filter(r => r.status === 'pending');

  useEffect(() => {
    if (!isAuthenticated || currentUser?.type !== 'admin') {
      router.replace('/login');
    }
  }, [isAuthenticated, currentUser, router]);

  if (!isAuthenticated || currentUser?.type !== 'admin') return null;

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-xl flex flex-col h-full">
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => router.push('/admin')}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">forum</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none tracking-tight">Chatify</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admin Control</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1">
            {ADMIN_NAV.map(({ href, label, icon, badge }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active 
                    ? 'bg-primary/10 text-primary font-bold shadow-[inset_4px_0_0_#2463eb]' 
                    : 'text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  <span>{label}</span>
                  {badge && pendingRequests.length > 0 && (
                    <span className="ml-auto bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm shadow-primary/30">
                      {pendingRequests.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 pb-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 px-2 mb-4 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors cursor-pointer" onClick={() => { logout(); router.push('/login'); }}>
               <span className="material-symbols-outlined text-red-500 text-[20px]">logout</span>
               <span className="text-sm font-semibold text-red-500">Logout Admin</span>
            </div>

            <div className="flex items-center gap-3 px-2 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700/50">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10 shadow-sm">
                <img alt="Admin Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv54Qx9wlhjB1gghswl4iwni1eAVl_ULy1Uv2VDLHM-V-ABvPiIEmSYLBZi456xhCvcwz6JfANJaFPa7kGRRVtcE3Oj445gTZd_7JuQtx9kUunqoXY4NTCjox_J7pgGnvA5JIcrGxv408uu6auMlbVOOFJ4Jgj10IvdrL6vdBdqSMoVcNfndCRE1hcbEEsRCAjGJJbubK5cHXvbGevlP-w4sXRJE5b2kiqGlT6A08xZOeZ2iR3mJgjlA1GpG9PX7NZdo9nmlr9eYc"/>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate tracking-tight">{currentUser?.displayName || 'Admin User'}</p>
                <p className="text-[11px] text-slate-500 font-medium truncate tracking-wide uppercase">System Architect</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none -z-10" />
        {children}
      </main>
    </div>
  );
}
