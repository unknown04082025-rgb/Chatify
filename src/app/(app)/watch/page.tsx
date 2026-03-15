/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
'use client';
import { useState, useEffect } from 'react';
import {
  Play, Plus, Users, Loader2, Monitor, Volume2, Mic, Upload
} from 'lucide-react';

export default function WatchPage() {
  const [inRoom, setInRoom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [screenSharing, setScreenSharing] = useState(false);
  const [audioSharing, setAudioSharing] = useState(false);
  const [voiceChat, setVoiceChat] = useState(false);
  const [currentTime, setCurrentTime] = useState(2538); // 42:18
  
  const totalTime = 5040; // 1:24:00

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playing) {
      interval = setInterval(() => {
        setCurrentTime(t => Math.min(t + speed, totalTime));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playing, speed]);

  const handleJoin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setInRoom(true);
    }, 1200);
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / totalTime) * 100;

  if (!inRoom) {
     return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 min-h-full">
           <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cobalt-accent text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>movie</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Watch Cinema</h1>
                    <p className="text-sm text-slate-500 font-medium tracking-wide">Watch movies together in real-time</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Create Room */}
                 <button onClick={() => setInRoom(true)} className="glass-panel group relative overflow-hidden rounded-3xl p-8 flex flex-col items-center justify-center gap-4 border border-slate-200 dark:border-slate-700/50 hover:border-primary/50 transition-all text-center">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-400 text-white flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                       <Plus size={32} />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold">Create Room</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start a new cinema room and invite friends</p>
                    </div>
                 </button>

                 {/* Join Room */}
                 <div className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center gap-5 border border-slate-200 dark:border-slate-700/50 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] pointer-events-none"></div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20">
                       <Users size={32} />
                    </div>
                    <div className="w-full max-w-xs space-y-4">
                       <h3 className="text-lg font-bold">Join Room</h3>
                       <input 
                         type="text" 
                         placeholder="Paste room code..." 
                         className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-center text-sm focus:ring-2 focus:ring-emerald-500/50 focus:outline-none transition-all"
                       />
                       <button 
                         onClick={handleJoin} 
                         disabled={loading}
                         className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                       >
                         {loading ? <Loader2 size={18} className="animate-spin" /> : 'Join Room'}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // Exact Stitch HTML structure for Watch Cinema translated to React
  return (
    <div className="flex h-full w-full flex-col overflow-hidden antialiased relative">
      <style dangerouslySetInnerHTML={{__html: `
        .video-gradient {
            background: linear-gradient(to top, rgba(17, 22, 33, 1) 0%, rgba(17, 22, 33, 0) 100%);
        }
      `}} />
      
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between z-10 border-b border-slate-200 dark:border-slate-800">
        <div onClick={() => setInRoom(false)} className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight tracking-tight">The Midnight Horizon</h2>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest">Live with 12 Friends</p>
          </div>
        </div>
        <div className="flex size-10 items-center justify-center">
          <button className="flex items-center justify-center rounded-full size-10 bg-primary/10 text-primary hover:bg-primary/20 transition-all">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </div>

      {/* Cinematic Video Player Area */}
      <div className="relative flex-none lg:flex-1 w-full flex flex-col items-center justify-start bg-black">
        {/* Video Mockup */}
        <div className="relative w-full aspect-video lg:h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuADMmY7GyagARCL1byOWgXnfda-gRqlqUgdtAVzLPel6Z0UHzOVtzwoS2olZDW610zkB6V-5Hezw84ruA_tQIoLRWmZSZ1QJW3OiUEovRDxawEv1Df0B_U0aUbrGnSVT40B41oPf5aCnF8tZ6bOKB3g8gEAVXaThuLV_SKAili1cPAkXNatAP_ciyc270QWM3jgSgPlPSJb-56z0_KqlEwh67QhGR70_vU-jTJPCD_PYBiwwGddKeja22xiauctrJ7QZEBpiOJ6E2Y')" }}>
          
          {screenSharing && (
              <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs text-white font-bold flex items-center gap-2 shadow-lg z-20">
                <Monitor size={14} /> Screen Sharing
              </div>
          )}

          {/* Floating Avatars Over Video */}
          <div className="absolute top-4 left-4 flex -space-x-3 z-20">
            <div className="relative">
              <img className="size-9 rounded-full border-2 border-background-dark object-cover bg-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLuz0jDIU6sJudB8x8xcRm7I8uts7J0fdNV0hRJ-swcJST5Rf_XFHxIMt91j79wTOiyLfBvD5uMwR0d_ECJ4xmFKauR8HelU-YbFlmx_InIKH7yocq7P1EegjMFZm2fvY3VRwR_GpOQAzy4XPKoLLZQMypA2yok8TQKtwFBtvK7mzv2swKHTAyeZOHTb_qBMS72rCQcPcEohPUvjzQgys7A5GO3auSySnGkBQFYXAO6FiOQ2AcDMCeg976p-TZDNoXdYEUSBaoS58" alt="Avatar 1" />
              <div className="absolute -bottom-1 -right-1 size-3 bg-green-500 border-2 border-background-dark rounded-full"></div>
            </div>
            <div className="relative border-2 border-primary rounded-full p-0.5 bg-background-dark">
              <img className="size-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2-F3_a6TO1XGcMSbKywHLJCPoSb8PT05cpv7hh3QCZg_bUycWCJHRyWt_sGbEmXzCDwETahST53qUBIhiQSM7HmCyUIRqGLq0BdFZGzHsBqkvpL6_nT75GVHCmSdy6voNtnOAAXP56vVpzG6VVzxy5FC8XB4APctUfcGb6Bgwmg3CZrs7xplriit3rMtfMWRQGqa2ocbNWZ1peP_clhDZjC3Rpv3FVBTHuIKAkSPraR43MuoR6vZadUwj6b4mkzVtqxAHJFwqbZU" alt="Avatar 2" />
              {/* Voice indicator wave mockup */}
              <div className="absolute -top-1 -right-1 flex gap-0.5 items-end h-3 px-1 bg-primary rounded-full">
                <div className="w-0.5 h-1 bg-white"></div>
                <div className="w-0.5 h-2 bg-white animate-pulse"></div>
                <div className="w-0.5 h-1.5 bg-white"></div>
              </div>
            </div>
            <div className="relative">
              <img className="size-9 rounded-full border-2 border-background-dark object-cover bg-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9jPhLDTlv6FbUIEg2Gbv-dMbToKArkhBmJwjLuge1a-pqBm_8IcdpSDGALF6Bn5h3S_zCC4G7iKpPxejAe109NEO1S-2wu0KWiAqB2WNBVv4yknKronSosIJrUxWFJvl6shsS0cRmnwOzZ72yRBMGZG0qWVXyu3NY9Q7dOUK_N3WraO19n4R4nayE2kX8Bcf0Y9jd1-h66w11qeW1tSU5jJmkVNmcTq0PkdVkIAb-FnZyu33hYO-e5bI6xK55ZPV6V6SLt76U9zM" alt="Avatar 3" />
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-800/80 border-2 border-background-dark text-[10px] font-bold text-white z-10">
                +8
            </div>
          </div>
          
          {/* Playback Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <button onClick={() => setPlaying(!playing)} className="glass-panel flex shrink-0 items-center justify-center rounded-full size-20 text-white hover:scale-105 transition-transform active:scale-95 pointer-events-auto">
              <span className="material-symbols-outlined text-4xl ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                {playing ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>

          {/* Bottom Video Controls */}
          <div className="absolute inset-x-0 bottom-0 px-6 py-6 video-gradient z-20">
            {/* Progress Bar */}
            <div className="flex items-center gap-3 mb-4">
              <p className="text-white/80 text-xs font-medium tabular-nums">{formatTime(currentTime)}</p>
              <div 
                className="relative flex-1 h-1.5 group cursor-pointer py-2"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const newPercent = (e.clientX - rect.left) / rect.width;
                  setCurrentTime(newPercent * totalTime);
                }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-1.5 bg-white/20 rounded-full"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 bg-primary rounded-full transition-all duration-100 ease-linear" style={{ width: `${progressPercent}%` }}></div>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3.5 bg-white border-2 border-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `${progressPercent}%` }}></div>
              </div>
              <p className="text-white/80 text-xs font-medium tabular-nums">{formatTime(totalTime)}</p>
            </div>
            
            {/* Functional Icons Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-white/90 cursor-pointer hover:text-white transition-colors">subtitles</span>
                <div onClick={() => setSpeed(s => s === 1 ? 1.5 : (s === 1.5 ? 2 : 1))} className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-[11px] font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-white/20 transition-all select-none">
                    {speed}x
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <button onClick={() => setScreenSharing(!screenSharing)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${screenSharing ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/90 hover:bg-white/20'}`}>
                    <Monitor size={14} />
                  </button>
                  <button onClick={() => setAudioSharing(!audioSharing)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${audioSharing ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/90 hover:bg-white/20'}`}>
                    <Volume2 size={14} />
                  </button>
                  <button onClick={() => setVoiceChat(!voiceChat)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${voiceChat ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/90 hover:bg-white/20'}`}>
                    <Mic size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span onClick={() => setMuted(!muted)} className="material-symbols-outlined text-white/90 cursor-pointer hover:text-white transition-colors">
                  {muted ? 'volume_off' : 'volume_up'}
                </span>
                <span className="material-symbols-outlined text-white/90 cursor-pointer hover:text-white transition-colors">fullscreen</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interaction Area */}
      <div className="flex-1 w-full flex flex-col max-h-full">
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Live Chat</span>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            <span className="material-symbols-outlined text-primary text-[14px]">group</span>
            <span className="text-slate-900 dark:text-slate-100 text-xs font-bold tracking-tight">1.2k</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex gap-3">
            <img className="size-8 rounded-full shrink-0 object-cover bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVRwRelQ22gwK3h4lZoNfayPhRh16ds6a1MuaKkr19FFlPZRxQMlGuuAwHm1f8u-Ltq7PZRPgRXVi-7FAKgQPkTtXsMXZSSeLDojs7sTamO0DNl8Wupc-GdZNmfXTeU6t9ULUwGWQGc82SUayqlhezrqI9vn2unOwDkPkXgq1FSYuGnedlqU1zaTdWmPSODXs76tYWcuGd5EBNWPthCcUyIsWjqRFuvA1RfIvRFbRec0i3_t1DZFW87mG7Bp7x1IWPn5NGUGM0bx4" alt="Marcus" />
            <div className="flex flex-col">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Marcus Wright</p>
              <p className="text-sm bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700/50 p-2.5 rounded-r-2xl rounded-bl-2xl mt-1">This scene is absolutely incredible in 4K! 🎬</p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <div className="flex flex-col items-end">
              <p className="text-[11px] font-bold text-primary">You</p>
              <p className="text-sm bg-gradient-to-r from-primary to-cobalt-accent shadow-md shadow-primary/20 border border-primary/20 text-white p-2.5 rounded-l-2xl rounded-br-2xl mt-1">Wait for the twist coming in 5 minutes...</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <img className="size-8 rounded-full shrink-0 object-cover bg-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADodgsv75EqPEV1gafDOXYtwbOk5qfwleFgp9hIQvPQ8w4EAXFi5DC5k-QopWNJklZkLkWfYqaUjajAx6SVRL2AT4iMbRtvOkJMnBNCebnO-2-_qWxttiTNiB4ZE8c3yqb2fplJoaWHP4sxR2xFb6_-msvhvEAAty1LPhMx_7uf4yzzRO28FnYuByRLhx3ogJaRvGJ2_ab1YKMB1fqBhzehUQ85_douRTBaP_3EVlvlhp73T--bpuo8UiF_9d7MXP8ORzVGX2FcIY" alt="Sarah" />
            <div className="flex flex-col">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Sarah Jenkins</p>
              <p className="text-sm bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700/50 p-2.5 rounded-r-2xl rounded-bl-2xl mt-1">Don't spoil it! haha 😂</p>
            </div>
          </div>
        </div>
        
        {/* Chat Input */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 rounded-full pl-4 pr-1.5 py-1.5 border border-slate-200 dark:border-slate-700/50 focus-within:border-primary/50 transition-colors shadow-inner">
            <span className="material-symbols-outlined text-slate-400 text-lg">sentiment_satisfied</span>
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 placeholder:text-slate-500 text-slate-900 dark:text-white outline-none" 
              placeholder="Message group..." 
              type="text"
            />
            <button className="flex shrink-0 items-center justify-center size-8 bg-gradient-to-br from-primary to-cobalt-accent rounded-full text-white shadow-md shadow-primary/20 hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[16px]">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
