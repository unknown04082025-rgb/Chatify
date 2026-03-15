'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mock-data';
import { formatRelativeTime, formatMessageTime } from '@/lib/crypto';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

// ─── Typing Indicator ────────────────────────────────
function TypingIndicator({ isTyping }: { isTyping: boolean }) {
  if (!isTyping) return null;
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="glass-bubble px-4 py-2 rounded-full">
        <div className="flex gap-1">
          <span className="size-1.5 rounded-full bg-slate-400"></span>
          <span className="size-1.5 rounded-full bg-slate-400"></span>
          <span className="size-1.5 rounded-full bg-slate-400"></span>
        </div>
      </div>
    </div>
  );
}

// ─── Wave bars for voice ──────────────────────────────
function VoiceWaveform({ bars = 8, isPlaying = false, isSelf = false }: { bars?: number, isPlaying?: boolean, isSelf?: boolean }) {
  return (
    <div className="flex items-center gap-1 h-6">
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} 
          className={`w-1 rounded-sm ${isSelf ? 'bg-white/80' : 'bg-primary'}`}
          style={{
            // eslint-disable-next-line react-hooks/purity
            height: `${Math.random() * 16 + 6}px`,
            animation: isPlaying ? 'wave-bounce 1s infinite ease-in-out alternate' : 'none',
            animationDelay: `${i * 0.1}s`,
            // eslint-disable-next-line react-hooks/purity
            animationDuration: `${0.4 + Math.random() * 0.3}s`,
          }} />
      ))}
    </div>
  );
}

function VoiceMessage({ content, isSelf }: { content: string, isSelf: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const durationMatch = content.match(/0:(\d+)/);
  const totalSeconds = durationMatch ? parseInt(durationMatch[1]) : 15;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= totalSeconds) {
            setIsPlaying(false); return 0;
          }
          return p + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex items-center gap-3">
      <button onClick={togglePlay} className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isSelf ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-primary text-white hover:bg-primary/90 shadow-[0_4px_12px_rgba(36,99,235,0.3)]'}`}>
        <span className="material-symbols-outlined text-[18px]">{isPlaying ? 'stop' : 'play_arrow'}</span>
      </button>
      <VoiceWaveform bars={12} isPlaying={isPlaying} isSelf={isSelf} />
      <span className="text-[11px] opacity-90 min-w-[35px] font-semibold">
        0:{String(isPlaying ? progress : totalSeconds).padStart(2, '0')}
      </span>
    </div>
  );
}

function AfterViewMessage({ content }: { content: string }) {
  const [state, setState] = useState<'hidden' | 'confirming' | 'visible'>('hidden');

  if (state === 'hidden') {
    return (
      <div onClick={() => setState('confirming')} className="flex items-center gap-2 cursor-pointer p-1">
        <span className="material-symbols-outlined text-amber-500 text-lg">visibility</span>
        <span className="text-sm italic opacity-90 text-amber-500">Tap to view secure message</span>
      </div>
    );
  }

  if (state === 'confirming') {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Message will permanently disappear after viewing. View now?</span>
        <div className="flex gap-2">
          <button onClick={() => setState('visible')} className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg text-white text-xs font-bold transition-transform active:scale-95">Yes, view it</button>
          <button onClick={() => setState('hidden')} className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs font-semibold transition-colors hover:bg-white/20">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-amber-500 text-sm">visibility</span>
        <span className="text-sm">{content}</span>
      </div>
      <div className="text-[10px] text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md w-fit">
        ⚠️ Will disappear when you leave chat
      </div>
    </div>
  );
}

function SnapMessage({ content }: { content: string }) {
  const [state, setState] = useState<'hidden' | 'viewing' | 'viewed'>('hidden');
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state === 'viewing') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setState('viewed'); return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state]);

  if (state === 'viewed') {
    return (
      <div className="flex items-center gap-2 opacity-50">
        <span className="material-symbols-outlined text-amber-500 text-sm">bolt</span>
        <span className="text-sm italic line-through">Snap viewed</span>
      </div>
    );
  }

  if (state === 'viewing') {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200">
        <div className="absolute top-6 right-6 text-white text-2xl font-bold bg-black/50 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10">
          {timeLeft}s
        </div>
        <div className="w-[90%] max-w-md aspect-[3/4] rounded-3xl bg-gradient-to-br from-amber-500 to-pink-500 flex flex-col items-center justify-center p-8 text-center text-white shadow-[0_25px_80px_rgba(245,158,11,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] animate-in zoom-in-95 duration-300">
          <div className="p-6 bg-white/15 rounded-full border-4 border-white/30 backdrop-blur-md mb-8 text-5xl">📸</div>
          <div className="text-3xl font-bold drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => setState('viewing')} className="flex items-center gap-3 cursor-pointer px-4 py-3 bg-gradient-to-r from-amber-500/10 to-transparent rounded-xl border border-amber-500/20 hover:from-amber-500/20 transition-colors">
      <div className="size-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(245,158,11,0.4)]">
        <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
      </div>
      <div>
        <div className="text-sm font-bold text-amber-300">New Snap</div>
        <div className="text-[11px] opacity-80 text-amber-500">Tap to view • Disappears in 5s</div>
      </div>
    </div>
  );
}

export default function ChatsPage() {
  const { chats, messages, activeChatId, setActiveChat, sendMessage, setTyping, typingUsers, currentUser, startCall, receiveCall, friendRequests } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [msgType, setMsgType] = useState<'normal' | 'after-view' | 'timed-delete'>('normal');
  const [isRecording, setIsRecording] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmCall, setConfirmCall] = useState<{ partnerId: string, type: 'voice' | 'video' } | null>(null);
  const [confirmClear, setConfirmClear] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const chatMessages = activeChatId ? (messages[activeChatId] || []) : [];
  const isTyping = activeChatId ? typingUsers[activeChatId] : false;

  const getOtherUser = (chat: (typeof chats)[0]) => {
    const otherId = chat.participantIds.find((id) => id !== currentUser?.id);
    return MOCK_USERS.find((u) => u.id === otherId);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages]);

  const handleInputChange = (val: string) => {
    setInputText(val);
    if (activeChatId) {
      setTyping(activeChatId, true);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        if (activeChatId) setTyping(activeChatId, false);
      }, 1500);
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || !activeChatId) return;
    sendMessage(activeChatId, inputText.trim(), msgType);
    setInputText('');
    setMsgType('normal');
    // Simulate friend reply
    setTimeout(() => {
      setTyping(activeChatId!, true);
      setTimeout(() => { setTyping(activeChatId!, false); }, 2000);
    }, 500);
  };

  const handleSendSnap = () => {
    if (!activeChatId) return;
    sendMessage(activeChatId, 'Secure visual intel received.', 'snap');
  };

  const acceptedFriendsIds = currentUser ? friendRequests
    .filter(r => r.status === 'accepted' && (r.senderId === currentUser.id || r.receiverId === currentUser.id))
    .map(r => r.senderId === currentUser.id ? r.receiverId : r.senderId) : [];

  const filteredChats = chats.filter((c) => {
    const other = getOtherUser(c);
    if (!other || !acceptedFriendsIds.includes(other.id)) return false;
    return other.username.includes(search) || other.displayName.toLowerCase().includes(search.toLowerCase());
  });

  const msgTypeConfig = {
    normal: { icon: 'send', label: 'Normal' },
    'after-view': { icon: 'visibility', label: 'After-view' },
    'timed-delete': { icon: 'delete', label: 'Delete in 3h' },
  };

  const executeCall = () => {
    if (confirmCall) {
      startCall(confirmCall.partnerId, confirmCall.type);
      setConfirmCall(null);
    }
  };

  const handleClearChat = () => {
    if (confirmClear && activeChatId) {
      useAppStore.setState(s => ({ messages: { ...s.messages, [activeChatId]: [] } }));
      setConfirmClear(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-var(--nav-height))] w-full bg-background-light dark:bg-[#0b0e14]">
      
      {/* Mesh Background for empty state / transparency */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none -z-10" />

      <ConfirmDialog
        isOpen={confirmCall !== null}
        title={`Start ${confirmCall?.type === 'video' ? 'Video' : 'Voice'} Call`}
        message="Are you sure you want to start this encrypted E2E call?"
        onConfirm={executeCall}
        onCancel={() => setConfirmCall(null)}
      />

      <ConfirmDialog
        isOpen={confirmClear !== null}
        title="Clear Chat History"
        message="Are you sure you want to delete all messages in this chat permanently?"
        confirmText="Clear Chat"
        onConfirm={handleClearChat}
        onCancel={() => setConfirmClear(null)}
      />

      {/* ── Sidebar: Chat List (Mobile Hub Style) ── */}
      <aside
        className={`${activeChatId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-[340px] flex-col border-r border-slate-200/10 bg-[#131022]/90 backdrop-blur-xl shrink-0`}
      >
        <div className="p-6 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Chats</h2>
            <div className="px-2 py-1 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">lock</span>
              AES-256
            </div>
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
            <input 
              type="text" 
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-slate-500 text-slate-100 transition-all"
              placeholder="Search conversations..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          {filteredChats.map((chat) => {
            const other = getOtherUser(chat);
            if (!other) return null;
            const isActive = activeChatId === chat.id;

            return (
              <button key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full flex items-center gap-4 p-3.5 rounded-xl cursor-pointer transition-all border outline-none ${
                    isActive 
                    ? 'glass-panel border-l-4 border-l-primary border-t-white/5 border-r-white/5 border-b-white/5 bg-slate-800/40' 
                    : 'border-transparent hover:bg-slate-800/30 hover:border-slate-200/5'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`size-12 rounded-full overflow-hidden flex items-center justify-center text-2xl bg-gradient-to-br from-primary/80 to-purple-600/80 shadow-lg ${isActive ? 'border-2 border-primary/50' : 'border border-slate-200/10'}`}>
                    {other.avatar}
                  </div>
                  {other.status === 'available' ? (
                    <div className="absolute bottom-0 -right-0.5 size-3.5 bg-green-500 rounded-full border-2 border-[#131022] neon-glow" />
                  ) : (
                    <div className="absolute bottom-0 -right-0.5 size-3.5 bg-slate-500 rounded-full border-2 border-[#131022]" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`font-semibold truncate ${isActive ? 'text-slate-100' : 'text-slate-200'}`}>{other.displayName}</h3>
                    <span className={`text-[11px] font-medium ${isActive ? 'text-primary' : 'text-slate-500'}`}>
                      {chat.lastMessage ? formatRelativeTime(chat.lastMessage.timestamp) : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2 mt-1">
                    <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>
                      {chat.isTyping ? (
                         <span className="text-primary font-medium animate-pulse">typing...</span>
                      ) : (
                         chat.lastMessage?.content || 'Say hello!'
                      )}
                    </p>
                    {chat.unreadCount > 0 && (
                      <div className="size-5 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(36,99,235,0.6)]">
                         <span className="text-[10px] font-bold text-white leading-none">{chat.unreadCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Chat Area (Desktop Dashboard Style) ── */}
      {activeChatId && activeChat ? (() => {
        const other = getOtherUser(activeChat)!;
        return (
          <main className="flex-1 flex flex-col min-w-0 relative">
            
            {/* Header Section */}
            <header className="h-20 flex items-center justify-between px-6 glass-panel border-b border-slate-200/10 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <button className="md:hidden size-10 flex items-center justify-center rounded-full glass-panel hover:bg-white/5 transition-colors" onClick={() => setActiveChat(null)}>
                  <span className="material-symbols-outlined text-slate-300">arrow_back</span>
                </button>
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="size-11 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br from-primary/80 to-purple-600/80 shadow-lg border border-white/10">
                      {other.avatar}
                    </div>
                    {other.status === 'available' ? (
                       <div className="absolute bottom-0 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-background-dark neon-glow" />
                    ) : (
                       <div className="absolute bottom-0 -right-0.5 size-3 bg-slate-500 rounded-full border-2 border-background-dark" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-100">{other.displayName}</h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isTyping ? (
                         <span className="text-xs text-primary font-medium flex items-center gap-1">
                            <span className="animate-pulse">typing...</span>
                         </span>
                      ) : (
                         <>
                            <span className={`size-1.5 rounded-full ${other.status === 'available' ? 'bg-green-500 neon-glow' : 'bg-slate-500'}`}></span>
                            <span className="text-[11px] font-medium text-slate-400">@{other.username}</span>
                         </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button title="Simulate Incoming" onClick={() => receiveCall(other.id, 'video')} className="size-10 hidden sm:flex items-center justify-center rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 hover:scale-105 transition-all">
                  <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                </button>
                <button onClick={() => setConfirmCall({ partnerId: other.id, type: 'voice' })} className="size-10 flex items-center justify-center rounded-full bg-slate-800/80 border border-white/5 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/20 transition-all">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </button>
                <button onClick={() => setConfirmCall({ partnerId: other.id, type: 'video' })} className="size-10 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 transition-all hover:scale-105">
                  <span className="material-symbols-outlined text-[20px]">videocam</span>
                </button>
                <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>
                <button onClick={() => setConfirmClear(other.id)} className="size-10 hidden sm:flex items-center justify-center rounded-full bg-slate-800/80 border border-white/5 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/20 transition-all">
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </header>

            {/* Chat Area Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 flex flex-col pt-6">
              
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400/90 text-[10px] font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  End-to-End Encrypted
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Today</div>
              </div>

              {chatMessages.map((msg) => {
                const isSelf = msg.senderId === currentUser?.id;
                const sender = MOCK_USERS.find((u) => u.id === msg.senderId);
                
                return (
                  <div key={msg.id} className={`flex items-end gap-3 max-w-[85%] sm:max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 ${isSelf ? 'justify-end ml-auto' : ''}`}>
                    {!isSelf && (
                      <div className="size-8 rounded-full bg-gradient-to-br from-primary/80 to-purple-600/80 shrink-0 mb-1 flex items-center justify-center text-sm shadow-sm border border-white/10">
                        {sender?.avatar}
                      </div>
                    )}
                    
                    <div className={`space-y-1 ${isSelf ? 'text-right' : ''}`}>
                      <p className={`text-[10px] font-medium text-slate-500 ${isSelf ? 'mr-2' : 'ml-2'}`}>
                        {isSelf ? 'Me' : sender?.displayName} • {formatMessageTime(msg.timestamp)}
                      </p>
                      
                      <div className={`
                        p-3.5 sm:p-4 rounded-2xl 
                        ${isSelf ? 'glass-bubble-primary rounded-br-none text-white shadow-lg shadow-primary/20' : 'glass-bubble rounded-bl-none text-slate-200 shadow-sm border-white/5'}
                      `}>
                        {msg.type === 'voice' ? (
                          <VoiceMessage content={msg.content} isSelf={isSelf} />
                        ) : msg.type === 'after-view' ? (
                          <AfterViewMessage content={msg.content} />
                        ) : msg.type === 'snap' ? (
                          <SnapMessage content={msg.content} />
                        ) : msg.type === 'timed-delete' ? (
                          <div className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm">delete</span>
                             <span className="text-sm">{msg.content}</span>
                             <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 ml-1/2 border border-red-500/20">3h</span>
                          </div>
                        ) : (
                          <div className="text-sm leading-relaxed whitespace-pre-wrap word-break">{msg.content}</div>
                        )}
                      </div>
                      
                      {isSelf && (
                        <div className="flex items-center justify-end gap-1 mt-1 pr-1">
                          {msg.encrypted && <span className="material-symbols-outlined text-slate-500 text-[11px]" style={{fontVariationSettings: "'FILL' 1"}}>lock</span>}
                          <span className="material-symbols-outlined text-primary text-[14px]">done_all</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              <TypingIndicator isTyping={isTyping} />
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <footer className="glass-panel border-t border-slate-200/10 p-4 sm:p-6 shrink-0 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                  {(Object.keys(msgTypeConfig) as Array<keyof typeof msgTypeConfig>).map((type) => {
                    const isActive = msgType === type;
                    return (
                    <button key={type} onClick={() => setMsgType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border
                        ${isActive 
                          ? 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_10px_rgba(36,99,235,0.2)]' 
                          : 'bg-slate-800/40 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'}`
                      }>
                      <span className="material-symbols-outlined text-[16px]">{msgTypeConfig[type].icon}</span>
                      {msgTypeConfig[type].label}
                    </button>
                  )})}
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-end gap-2 sm:gap-4">
                  <button onClick={handleSendSnap} className="size-12 shrink-0 flex items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:scale-105 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)] group" title="Send Secure Snap">
                    <span className="material-symbols-outlined text-xl group-hover:text-amber-300" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                  </button>
                  <button className="size-12 shrink-0 hidden sm:flex items-center justify-center rounded-2xl bg-slate-800/50 border border-white/5 text-slate-400 hover:text-primary transition-colors hover:bg-slate-800">
                    <span className="material-symbols-outlined pt-0.5">add_circle</span>
                  </button>
                  
                  <div className="flex-1 relative w-full sm:w-auto mt-2 sm:mt-0 order-last sm:order-none">
                    <input 
                      type="text" 
                      className="w-full bg-slate-900/60 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-slate-500 text-slate-100 transition-all pr-12 min-h-[56px]"
                      placeholder="Type an encrypted message..." 
                      value={inputText}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">mood</span>
                    </button>
                  </div>

                  {inputText ? (
                    <button onClick={handleSend} className="size-12 px-5 shrink-0 bg-primary hover:bg-primary/90 min-w-12 sm:min-w-fit w-12 sm:w-auto text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-transform active:scale-95">
                      <span className="font-bold hidden sm:inline">Send</span>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                  ) : (
                    <button 
                      onMouseDown={() => setIsRecording(true)}
                      onMouseUp={() => { setIsRecording(false); if(activeChatId) sendMessage(activeChatId, '0:' + String(Math.floor(Math.random() * 40 + 5)).padStart(2, '0'), 'voice'); }}
                      onMouseLeave={() => setIsRecording(false)}
                      className={`size-12 shrink-0 rounded-2xl flex items-center justify-center transition-all ${
                        isRecording 
                        ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-110 text-white' 
                        : 'bg-slate-800/80 hover:bg-primary/20 hover:text-primary border border-white/5 text-slate-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{isRecording ? 'mic' : 'mic_none'}</span>
                    </button>
                  )}
                </div>
              </div>
            </footer>
          </main>
        );
      })() : (
        <main className="hidden md:flex flex-1 flex-col items-center justify-center p-8 relative">
          <div className="absolute inset-0 bg-gradient-mesh opacity-20 z-0"></div>
          <div className="z-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="size-24 rounded-3xl bg-slate-800/40 border border-white/10 flex items-center justify-center text-5xl mb-6 shadow-2xl backdrop-blur-xl relative">
              <span className="material-symbols-outlined text-primary text-[48px]" style={{fontVariationSettings: "'FILL' 1"}}>chat</span>
              <div className="absolute -top-2 -right-2 size-8 bg-amber-500 rounded-xl border border-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] rotate-12">
                <span className="material-symbols-outlined text-background-dark text-[18px]">lock</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 mb-2">Workspace Hub</h2>
            <p className="text-slate-400 text-sm max-w-sm">Select a conversation from the left strictly verified and end-to-end encrypted protocol.</p>
          </div>
        </main>
      )}
    </div>
  );
}
