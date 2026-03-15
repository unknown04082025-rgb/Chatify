'use client';
import { MOCK_USERS, MOCK_ATITHI_REQUESTS } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';

export default function AdminDashboard() {
  const onlineUsers = MOCK_USERS.filter(u => u.status === 'available');
  const pendingRequests = MOCK_ATITHI_REQUESTS.filter(r => r.status === 'pending');

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              type="text" 
              className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 transition-all shadow-inner" 
              placeholder="Search systems, users, or logs..." 
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors relative border border-slate-200 dark:border-slate-700/50 hover:bg-slate-800 hover:shadow-lg">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {pendingRequests.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>}
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors border border-slate-200 dark:border-slate-700/50 hover:bg-slate-800">
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>
        </div>
      </header>
      
      <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Title */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">System Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Real-time monitoring and administrative management.</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-inner">
                <span className="material-symbols-outlined">group</span>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 shadow-sm">+12%</span>
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Total Users</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{MOCK_USERS.length}</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                <span className="material-symbols-outlined">wifi_tethering</span>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 shadow-sm">+5%</span>
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Online Users</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{onlineUsers.length}</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20 shadow-inner">
                <span className="material-symbols-outlined">database</span>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-500/10 px-2 py-1 rounded-md border border-slate-500/20 shadow-sm">Stable</span>
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Server Latency</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">24ms</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-inner">
                <span className="material-symbols-outlined">error</span>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 shadow-sm">-2%</span>
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Active Errors</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graph Section */}
          <div className="lg:col-span-2 p-8 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold">Login Activity</h3>
                <p className="text-sm font-medium text-slate-500">System authentications last 7 days</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                <span className="text-2xl font-bold tracking-tight">12.4k</span>
                <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded ml-2">+8.2%</span>
              </div>
            </div>
            <div className="h-64 w-full relative">
              <svg className="w-full h-full drop-shadow-xl" fill="none" preserveAspectRatio="none" viewBox="0 0 500 150">
                <path d="M0 120 C 50 110, 100 40, 150 60 S 250 100, 300 40 S 400 20, 500 50 V 150 H 0 Z" fill="url(#gradient)" opacity="0.15"></path>
                <path d="M0 120 C 50 110, 100 40, 150 60 S 250 100, 300 40 S 400 20, 500 50" fill="none" stroke="#3713ec" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3713ec"></stop>
                    <stop offset="100%" stopColor="transparent"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex justify-between mt-6 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
          
          {/* Pending Requests */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">Pending Access <span className="bg-amber-500/20 text-amber-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{pendingRequests.length}</span></h3>
              <button className="text-xs text-primary font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-4 flex-1">
              {pendingRequests.slice(0, 4).map((r, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-700/50 cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm text-slate-300">
                    {r.username.substring(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-slate-200">{r.username}</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">Atithi Request</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>
              ))}

              {pendingRequests.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 pb-8">
                   <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inventory_2</span>
                   <p className="text-sm font-medium">No pending requests</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Events Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-lg mt-8">
          <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800/50 flex justify-between items-center bg-slate-800/20">
            <h3 className="text-lg font-bold">Recent System Logs</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-colors border border-slate-700/50 shadow-sm">
              <span className="material-symbols-outlined text-sm">download</span>
              Export Logs
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-800/50">
                  <th className="px-8 py-5">Event</th>
                  <th className="px-8 py-5">User</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Timestamp</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-transparent">
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-default">
                  <td className="px-8 py-5 font-semibold text-slate-200">Database Backup</td>
                  <td className="px-8 py-5 font-medium text-slate-400">System Cron</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider shadow-sm">Success</span>
                  </td>
                  <td className="px-8 py-5 text-slate-500 text-sm font-medium">2 mins ago</td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded hover:bg-slate-800"><span className="material-symbols-outlined">more_horiz</span></button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-default">
                  <td className="px-8 py-5 font-semibold text-slate-200">Failed SSH Login</td>
                  <td className="px-8 py-5 font-medium text-red-400">192.168.1.42</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider shadow-sm">Blocked</span>
                  </td>
                  <td className="px-8 py-5 text-slate-500 text-sm font-medium">14 mins ago</td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded hover:bg-slate-800"><span className="material-symbols-outlined">more_horiz</span></button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-default">
                  <td className="px-8 py-5 font-semibold text-slate-200">API Key Rotated</td>
                  <td className="px-8 py-5 font-medium text-slate-400">Alex Rivard</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider shadow-sm">Updated</span>
                  </td>
                  <td className="px-8 py-5 text-slate-500 text-sm font-medium">45 mins ago</td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded hover:bg-slate-800"><span className="material-symbols-outlined">more_horiz</span></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
