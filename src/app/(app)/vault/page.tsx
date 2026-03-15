'use client';
import { useState } from 'react';
import { MOCK_VAULT_ITEMS } from '@/lib/mock-data';
import { Upload } from 'lucide-react';
import { useAppStore } from '@/lib/store';

function PinDot({ filled }: { filled: boolean }) {
  return (
    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
      filled 
        ? 'bg-primary border-primary shadow-[0_0_12px_rgba(36,99,235,0.4)] scale-110' 
        : 'bg-white/5 border-white/10 scale-100'
    }`} />
  );
}

export default function VaultPage() {
  const { vaultUnlocked, unlockVault, lockVault } = useAppStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  const handlePinPress = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        const ok = unlockVault(next);
        if (!ok) {
          setError('Incorrect PIN. Try 1234 for demo.');
          setShaking(true);
          setTimeout(() => { setShaking(false); setPin(''); setError(''); }, 800);
        }
      }, 200);
    }
  };

  if (!vaultUnlocked) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-140px)] relative overflow-hidden bg-slate-50 dark:bg-slate-900/30">
        
        {/* Unlock/Identity Section exactly from Stitch Template */}
        <div className={`relative p-10 md:p-12 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 text-center flex flex-col items-center justify-center overflow-hidden border border-slate-700 shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-500 ${shaking ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #2463eb 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="relative group cursor-default mb-2">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-700"></div>
                <div className="relative size-28 md:size-32 rounded-full border border-primary/50 flex flex-col items-center justify-center bg-[#111621]/90 text-primary shadow-[inset_0_0_20px_rgba(36,99,235,0.2)]">
                    <span className="material-symbols-outlined text-5xl md:text-6xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>fingerprint</span>
                </div>
            </div>
            
            <h1 className="text-2xl font-bold mt-6 text-white tracking-tight">Identity Verification</h1>
            <p className="text-slate-400 mt-2 text-sm max-w-sm mb-8 font-medium">Please enter your master PIN to decrypt and access sensitive files.</p>
            
            {/* Pin dots */}
            <div className="flex gap-4 justify-center mb-6">
              {[0,1,2,3].map((i) => <PinDot key={i} filled={i < pin.length} />)}
            </div>

            {/* Error Message */}
            <div className={`h-6 mb-2 transition-opacity duration-300 ${error ? 'opacity-100' : 'opacity-0'}`}>
              {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mx-auto z-10">
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key) => (
                <button 
                  key={key}
                  disabled={key === ''}
                  onClick={() => {
                    if (key === '⌫') setPin(p => p.slice(0,-1));
                    else if (key !== '') handlePinPress(key);
                  }}
                  className={`h-14 rounded-2xl flex items-center justify-center font-bold transition-all
                    ${key === '' ? 'cursor-default opacity-0' : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 text-white shadow-sm hover:shadow-[0_0_15px_rgba(36,99,235,0.2)] active:scale-95'}
                    ${key === '⌫' ? 'text-xl text-slate-400 hover:text-white' : 'text-2xl'}
                  `}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-2 text-emerald-500/80 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="material-symbols-outlined text-sm">lock</span>
              AES-256 Encrypted
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto w-full bg-slate-50 dark:bg-slate-900/30 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Header matching Stitch Dashboard style */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cobalt-accent text-white flex items-center justify-center shadow-lg shadow-primary/20">
                 <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
              </div>
              <div>
                 <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Secure Vault</h1>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Tunnel Active</p>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <button className="flex justify-center items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-primary to-cobalt-accent text-white rounded-xl font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5" onClick={() => {}}>
                  <Upload size={16} strokeWidth={3} />
                  <span>Upload Secure</span>
              </button>
              <button className="flex justify-center items-center gap-2 px-4 py-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl font-bold border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-sm" onClick={lockVault}>
                  <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                  <span className="hidden sm:inline">Lock Vault</span>
              </button>
           </div>
        </div>

        {/* Global info banner */}
        <div className="bg-white dark:bg-slate-800/60 p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
           <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                 <span className="material-symbols-outlined text-xl">security</span>
              </div>
              <div>
                 <p className="text-sm font-bold text-slate-800 dark:text-slate-200">End-to-End Encryption Active</p>
                 <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">All files are encrypted with AES-256 on your device before upload. We cannot read your files.</p>
              </div>
           </div>
           <div className="flex-shrink-0 w-full md:w-64 bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Storage</span>
                 <span className="text-[10px] font-bold text-primary">64%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-primary to-cobalt-accent w-[64%] rounded-full shadow-[0_0_5px_rgba(36,99,235,0.5)]"></div>
              </div>
           </div>
        </div>

        {/* Storage Grid from Stitch HTML */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Secure Storage Card */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-md flex flex-col gap-4 group hover:border-blue-500/50 transition-colors cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] pointer-events-none group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center justify-between z-10">
                    <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>hard_drive</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">more_vert</span>
                </div>
                <div className="z-10">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Secure Storage</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">1,240 encrypted files</p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex gap-2 z-10 mt-auto">
                    <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-widest">PDF</span>
                    <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-widest">DOCX</span>
                    <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ZIP</span>
                </div>
            </div>

            {/* Media Vault Card */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-md flex flex-col gap-4 group hover:border-purple-500/50 transition-colors cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-[100px] pointer-events-none group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center justify-between z-10">
                    <div className="size-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">more_vert</span>
                </div>
                <div className="z-10">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Media & Photos</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">452 hidden items</p>
                </div>
                <div className="flex -space-x-3 mt-auto pt-2 z-10">
                    <div className="size-10 rounded-lg border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover blur-[2px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxGYOD6Oa-NkF20hLjpjEGLr2jH7kLIghW5dORbYdE-5u5FSqBN7j6eoEIYg109G7-g92X2iVs2MTmxp6gslPDYQdlDrFD-OyWTcJ_AJjqXbkizX2vEZTtSY8rTZk4MaYK1KYsc73vlhFYpCIvlAG3TjlAu7ijWmbnxWeQos7DBdpcOPsBjr9_Zr4l8fIObLdtggj4knrbGGlXtJlVuzvoHgFyN7GQRS1V_sM9Uqbb31ZsyVhDhqbIyBz7BMHfD4k52MypEAtB4RM" alt="Media" />
                    </div>
                    <div className="size-10 rounded-lg border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover blur-[2px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM75lOgitSIRSLoGaZPK2Zr9-IHP26y-pld8qo3P4Xx9CATXFrwb4PPvziYK2cjDeRQjIBVX8MmcLXhltY4-VTV7vaklw4XggdccU-DQTpSxTX-pu2ilAHeIRMH9RWHjpzGOmhmVrkEPmXW7c5sRdD1ZdvSqgPyhH_Vteh4LmI6Qv6HZ9hlLhPkz_kMKEdKGBgKbGLVxlf52u1-kvXm9_bgkU3Yy5FwFR7HWRHEGDNDHgZ2wMHEsDQf0fDUtlWXrOFqJJurV-ZpPo" alt="Media" />
                    </div>
                    <div className="size-10 rounded-lg border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-sm z-10">
                        +450
                    </div>
                </div>
            </div>

            {/* Password Manager Card */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-md flex flex-col gap-4 group hover:border-amber-500/50 transition-colors cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[100px] pointer-events-none group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center justify-between z-10">
                    <div className="size-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>key_visualizer</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">more_vert</span>
                </div>
                <div className="z-10">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Passwords</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">82 stored credentials</p>
                </div>
                <div className="space-y-2 mt-auto pt-4 z-10 w-full">
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden">
                       <div className="h-full w-[40%] bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-pulse"></div>
                    </div>
                    <div className="h-2 w-2/3 bg-slate-200 dark:bg-slate-700/80 rounded-full opacity-50"></div>
                </div>
            </div>

        </div>

        {/* Individual File Items */}
        <div className="mt-8">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Recent Files</h3>
              <div className="flex gap-2">
                 {['All', 'Photos', 'Documents'].map(tab => (
                    <button key={tab} className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors border ${tab==='All' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                       {tab}
                    </button>
                 ))}
              </div>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {MOCK_VAULT_ITEMS.map((item) => (
                 <div key={item.id} className="bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group">
                    <div className={`h-28 sm:h-32 flex items-center justify-center text-4xl relative ${
                       item.type === 'image' ? 'bg-gradient-to-br from-indigo-900 to-purple-900' :
                       item.type === 'video' ? 'bg-gradient-to-br from-blue-900 to-cyan-900' :
                       'bg-gradient-to-br from-slate-800 to-zinc-900'
                    }`}>
                       <span className="group-hover:scale-110 transition-transform drop-shadow-xl">{item.type === 'image' ? '🖼️' : item.type === 'video' ? '🎬' : '🎤'}</span>
                       
                       {/* Lock overlay badge */}
                       <div className="absolute top-2 right-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-white/10 flex items-center gap-1 text-[10px] text-emerald-400 font-bold tracking-wider">
                          <span className="material-symbols-outlined text-[12px]">lock</span>
                       </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-transparent">
                       <p className="font-bold text-sm text-slate-900 dark:text-white truncate" title={item.name}>{item.name}</p>
                       <div className="flex items-center justify-between mt-1">
                          <p className="text-xs font-medium text-slate-500">{item.size}</p>
                          <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                             {item.type}
                          </span>
                       </div>
                    </div>
                 </div>
              ))}

              <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[160px] text-slate-400 hover:text-primary">
                 <Upload size={28} />
                 <span className="text-sm font-bold">Upload Secure</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
