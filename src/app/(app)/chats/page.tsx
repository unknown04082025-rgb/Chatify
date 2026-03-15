'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mock-data';
import { formatRelativeTime, formatMessageTime } from '@/lib/crypto';
import {
  Search, Phone, Video, MoreVertical, Send, Mic, Camera, MapPin,
  Zap, Lock, Trash2, Eye, Image, Smile, Hash, ChevronLeft,
  MicOff, Square, Play, Pause, PhoneIncoming
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

// ─── Typing Indicator ────────────────────────────────
function TypingIndicator({ isTyping }: { isTyping: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0' }}>
      <div style={{
        width: '10px', height: '10px', borderRadius: '50%',
        background: 'var(--accent-violet)',
        boxShadow: '0 0 8px rgba(124, 58, 237, 0.6)',
        animation: isTyping ? 'bounce-dot 0.6s infinite alternate' : 'none',
        transition: 'all 0.3s',
        transform: isTyping ? undefined : 'scale(1)',
      }} />
      {isTyping && (
        <span style={{ fontSize: '12px', color: 'var(--accent-violet)', fontWeight: 500 }}>typing...</span>
      )}
    </div>
  );
}

// ─── Wave bars for voice ──────────────────────────────
function VoiceWaveform({ bars = 8, isPlaying = false, isSelf = false }: { bars?: number, isPlaying?: boolean, isSelf?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '24px' }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} style={{
          width: '3px', borderRadius: '2px',
          background: isSelf ? 'rgba(255,255,255,0.8)' : 'var(--accent-violet)',
          height: `${Math.random() * 16 + 6}px`,
          animation: isPlaying ? 'wave-bounce 1s infinite ease-in-out alternate' : 'none',
          animationDelay: `${i * 0.1}s`,
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button onClick={togglePlay} style={{
        background: isSelf ? 'rgba(255,255,255,0.2)' : 'var(--gradient-primary)',
        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '32px', height: '32px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white',
        flexShrink: 0, boxShadow: isSelf ? 'none' : '0 4px 12px rgba(124,58,237,0.3)',
      }}>
        {isPlaying ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" style={{ marginLeft: '2px' }} />}
      </button>
      <VoiceWaveform bars={12} isPlaying={isPlaying} isSelf={isSelf} />
      <span style={{ fontSize: '11px', opacity: 0.9, minWidth: '35px', fontWeight: 600 }}>
        0:{String(isPlaying ? progress : totalSeconds).padStart(2, '0')}
      </span>
    </div>
  );
}

function AfterViewMessage({ content }: { content: string }) {
  const [state, setState] = useState<'hidden' | 'confirming' | 'visible'>('hidden');

  if (state === 'hidden') {
    return (
      <div onClick={() => setState('confirming')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px' }}>
        <Eye size={18} style={{ color: '#f59e0b' }} />
        <span style={{ fontSize: '14px', fontStyle: 'italic', opacity: 0.9, color: '#f59e0b' }}>Tap to view secure message</span>
      </div>
    );
  }

  if (state === 'confirming') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>Message will permanently disappear after viewing. View now?</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setState('visible')} style={{ padding: '6px 14px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Yes, view it</button>
          <button onClick={() => setState('hidden')} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Eye size={14} style={{ color: '#f59e0b' }} />
        <span style={{ fontSize: '15px' }}>{content}</span>
      </div>
      <div style={{ fontSize: '10px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.1)', padding: '4px 8px', borderRadius: '8px', width: 'fit-content' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
        <Zap size={14} color="#f59e0b" />
        <span style={{ fontSize: '14px', fontStyle: 'italic', textDecoration: 'line-through' }}>Snap viewed</span>
      </div>
    );
  }

  if (state === 'viewing') {
    return (
      <div className="snap-overlay" style={{ zIndex: 9999 }}>
        <div style={{ position: 'absolute', top: '24px', right: '24px', color: 'white', fontSize: '28px', fontWeight: 800, background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {timeLeft}s
        </div>
        <div style={{
          width: '90%', maxWidth: '440px', height: '80%', maxHeight: '700px', borderRadius: '24px',
          background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 25px 80px rgba(245,158,11,0.5), inset 0 1px 0 rgba(255,255,255,0.2)', fontSize: '64px',
          padding: '24px', textAlign: 'center', color: 'white', flexDirection: 'column', gap: '24px',
          animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{ padding: '32px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>📸</div>
          <div style={{ fontSize: '28px', fontWeight: 700, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => setState('viewing')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px 16px', background: 'linear-gradient(90deg, rgba(245,158,11,0.1), transparent)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.2)' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}>
        <Zap size={16} fill="white" />
      </div>
      <div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#fcd34d' }}>New Snap</div>
        <div style={{ fontSize: '11px', opacity: 0.8, color: '#f59e0b' }}>Tap to view • Disappears in 5s</div>
      </div>
    </div>
  );
}

export default function ChatsPage() {
  const router = useRouter();
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
    normal: { icon: <Send size={14} />, label: 'Normal' },
    'after-view': { icon: <Eye size={14} />, label: 'After-view' },
    'timed-delete': { icon: <Trash2 size={14} />, label: 'Delete in 3h' },
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
    <div style={{ display: 'flex', height: 'calc(100vh - var(--nav-height))', overflow: 'hidden' }}>
      
      {/* Mesh Background for empty state / transparency */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(124,58,237,0.06) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(236,72,153,0.04) 0px, transparent 50%)',
        zIndex: -1, pointerEvents: 'none',
      }} />

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

      {/* ── Sidebar: Chat List ── */}
      <div
        className={activeChatId ? 'desktop-only' : ''}
        style={{
          width: activeChatId ? undefined : '100%',
          minWidth: '340px', maxWidth: '340px',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: activeChatId ? 'none' : 'flex',
          flexDirection: 'column',
          background: 'rgba(12,17,35,0.6)', backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chats</h2>
            <div className="encrypt-badge">🔒 AES-256</div>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="input-field" style={{ paddingLeft: '44px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              placeholder="Search conversations..." value={search} onChange={(e) => setSearch(e.target.value)} id="chats-search" />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {filteredChats.map((chat) => {
            const other = getOtherUser(chat);
            if (!other) return null;
            return (
              <button key={chat.id} id={`chat-item-${chat.id}`}
                onClick={() => setActiveChat(chat.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '16px',
                  background: activeChatId === chat.id ? 'linear-gradient(90deg, rgba(124,58,237,0.15), rgba(124,58,237,0.02))' : 'transparent',
                  border: activeChatId === chat.id ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                  boxShadow: activeChatId === chat.id ? 'inset 4px 0 0 var(--accent-violet)' : 'none',
                }}
                onMouseEnter={(e) => { if (activeChatId !== chat.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { if (activeChatId !== chat.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '16px',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '26px', boxShadow: activeChatId === chat.id ? '0 0 15px rgba(124,58,237,0.4)' : 'none',
                    transition: 'all 0.3s',
                  }}>{other.avatar}</div>
                  <div style={{
                    position: 'absolute', bottom: '-2px', right: '-2px',
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: other.status === 'available' ? '#10b981' : '#475569',
                    border: '3px solid rgba(12,17,35,1)',
                  }} />
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>{other.displayName}</span>
                    <span style={{ fontSize: '11px', color: activeChatId === chat.id ? 'var(--accent-violet)' : 'var(--text-muted)' }}>
                      {chat.lastMessage ? formatRelativeTime(chat.lastMessage.timestamp) : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '13px', color: 'var(--text-secondary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px',
                    }}>
                      {chat.isTyping ? <span style={{ color: 'var(--accent-violet)', fontWeight: 500 }}>typing...</span> : (chat.lastMessage?.content || 'Say hello!')}
                    </span>
                    {chat.unreadCount > 0 && (
                      <div style={{
                        minWidth: '22px', height: '22px', borderRadius: '11px',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700, color: 'white', padding: '0 6px',
                        boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                      }}>{chat.unreadCount}</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chat Window ── */}
      {activeChatId && activeChat ? (() => {
        const other = getOtherUser(activeChat)!;
        return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
            
            {/* Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: '16px',
              background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(20px)',
              zIndex: 10,
            }}>
              <button className="mobile-only" onClick={() => setActiveChat(null)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                <ChevronLeft size={20} />
              </button>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '14px',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                  boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
                }}>{other.avatar}</div>
                <div style={{
                  position: 'absolute', bottom: '-2px', right: '-2px',
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: other.status === 'available' ? '#10b981' : '#475569',
                  border: '2px solid rgba(10,14,26,1)',
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{other.displayName}</div>
                <div style={{ fontSize: '12px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isTyping
                    ? <TypingIndicator isTyping={true} />
                    : <span className={other.status === 'available' ? 'status-available' : 'status-not-available'} style={{ fontSize: '11px', fontWeight: 600 }}>
                      {other.status === 'available' ? '● Available' : '○ Offline'}
                    </span>
                  }
                  <span style={{ color: 'var(--text-muted)' }}>• @{other.username}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button id="simulate-incoming-btn" title="Simulate Incoming Call" onClick={() => receiveCall(other.id, 'video')}
                  style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: '#ec4899', display: 'flex', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(236,72,153,0.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(236,72,153,0.1)'}>
                  <PhoneIncoming size={18} />
                </button>
                <button id="voice-call-btn" onClick={() => setConfirmCall({ partnerId: other.id, type: 'voice' })}
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: '#10b981', display: 'flex', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(16,185,129,0.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(16,185,129,0.1)'}>
                  <Phone size={18} />
                </button>
                <button id="video-call-btn" onClick={() => setConfirmCall({ partnerId: other.id, type: 'video' })}
                  style={{ background: 'var(--gradient-primary)', border: 'none', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: 'white', display: 'flex', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(124,58,237,0.3)' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                  <Video size={18} />
                </button>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />
                <button id="clear-chat-btn" onClick={() => setConfirmClear(other.id)}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: '#ef4444', display: 'flex', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Encryption Banner */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fcd34d', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}>
                  <Lock size={12} /> Messages are end-to-end encrypted. Nobody else can read them.
                </div>
              </div>

              {chatMessages.map((msg) => {
                const isSelf = msg.senderId === currentUser?.id;
                const sender = MOCK_USERS.find((u) => u.id === msg.senderId);
                return (
                  <div key={msg.id} style={{
                    display: 'flex',
                    justifyContent: isSelf ? 'flex-end' : 'flex-start',
                    gap: '12px', alignItems: 'flex-end',
                    animation: 'fadeInUp 0.3s ease forwards',
                  }}>
                    {!isSelf && (
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '10px',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', flexShrink: 0,
                      }}>{sender?.avatar}</div>
                    )}
                    <div style={{
                      maxWidth: '72%',
                      background: isSelf ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.03)',
                      border: isSelf ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: isSelf ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      padding: msg.type === 'voice' ? '12px 18px' : '12px 16px',
                      boxShadow: isSelf ? '0 8px 25px rgba(124,58,237,0.3)' : '0 4px 15px rgba(0,0,0,0.2)',
                      backdropFilter: isSelf ? 'none' : 'blur(10px)',
                    }}>
                      {/* Message body */}
                      {msg.type === 'voice' ? (
                        <VoiceMessage content={msg.content} isSelf={isSelf} />
                      ) : msg.type === 'after-view' ? (
                        <AfterViewMessage content={msg.content} />
                      ) : msg.type === 'snap' ? (
                        <SnapMessage content={msg.content} />
                      ) : msg.type === 'timed-delete' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Trash2 size={16} />
                          <span style={{ fontSize: '15px' }}>{msg.content}</span>
                          <span style={{ fontSize: '10px', opacity: 0.8, color: '#fca5a5', background: 'rgba(239,68,68,0.2)', padding: '2px 8px', borderRadius: '6px' }}>Deletes in 3h</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '15px', lineHeight: 1.5, textShadow: isSelf ? '0 1px 2px rgba(0,0,0,0.2)' : 'none' }}>{msg.content}</span>
                      )}

                      {/* Timestamp + encrypt */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                        {msg.encrypted && <Lock size={10} style={{ opacity: isSelf ? 0.8 : 0.5 }} color={isSelf ? 'white' : 'var(--accent-emerald)'} />}
                        <span style={{ fontSize: '10px', opacity: 0.7, color: isSelf ? 'white' : 'var(--text-muted)' }}>{formatMessageTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator from friend */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', animation: 'fadeIn 0.3s ease forwards' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    {other.avatar}
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '20px 20px 20px 4px', padding: '14px 18px',
                    display: 'flex', gap: '6px', alignItems: 'center', backdropFilter: 'blur(10px)',
                  }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div key={i} style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: 'var(--accent-violet)',
                        animation: `bounce-dot 0.8s ${delay}s infinite alternate`,
                        boxShadow: '0 0 8px rgba(124,58,237,0.5)',
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(20px)',
              position: 'relative', zIndex: 10,
            }}>
              {/* Message Type Selector */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {(Object.keys(msgTypeConfig) as Array<keyof typeof msgTypeConfig>).map((type) => (
                  <button key={type} id={`msg-type-${type}`}
                    onClick={() => setMsgType(type)}
                    style={{
                      padding: '6px 14px', borderRadius: '10px', fontSize: '12px',
                      fontWeight: msgType === type ? 600 : 500,
                      background: msgType === type ? `linear-gradient(90deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))` : 'rgba(255,255,255,0.03)',
                      border: msgType === type ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.06)',
                      color: msgType === type ? 'white' : 'var(--text-muted)',
                      cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      boxShadow: msgType === type ? '0 0 15px rgba(124,58,237,0.15)' : 'none',
                    }}>
                    {msgTypeConfig[type].icon}
                    {msgTypeConfig[type].label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                {/* Attachment buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button id="snap-btn" title="Send Snap"
                    onClick={handleSendSnap}
                    style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(236,72,153,0.15))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '14px', padding: '12px', cursor: 'pointer', color: '#f59e0b', display: 'flex', boxShadow: '0 4px 15px rgba(245,158,11,0.2)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                    <Zap size={20} />
                  </button>
                  <button id="image-btn" title="Attach Media"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '12px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
                    <Image size={20} />
                  </button>
                </div>

                <div style={{ flex: 1, position: 'relative' }}>
                  <input type="text" className="input-field" id="chat-input"
                    placeholder="Type an encrypted message..."
                    value={inputText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                    style={{ width: '100%', padding: '14px 16px', paddingRight: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', fontSize: '15px' }}
                  />
                  <Smile size={20} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>

                {/* Voice + Send */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {inputText ? (
                    <button id="send-btn" onClick={handleSend}
                      style={{ background: 'var(--gradient-primary)', border: 'none', borderRadius: '14px', padding: '12px 18px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(124,58,237,0.4)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>Send</span>
                      <Send size={18} />
                    </button>
                  ) : (
                    <button id="voice-msg-btn"
                      onMouseDown={() => setIsRecording(true)}
                      onMouseUp={() => {
                        setIsRecording(false);
                        if (activeChatId) sendMessage(activeChatId, '0:' + String(Math.floor(Math.random() * 40 + 5)).padStart(2, '0'), 'voice');
                      }}
                      style={{
                        background: isRecording ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'var(--gradient-primary)',
                        border: isRecording ? '2px solid #fca5a5' : '1px solid transparent',
                        borderRadius: '50%', width: '48px', height: '48px',
                        cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                        boxShadow: isRecording ? '0 0 30px rgba(239,68,68,0.6)' : '0 4px 20px rgba(124,58,237,0.4)',
                        transform: isRecording ? 'scale(1.1)' : 'scale(1)',
                      }}>
                      {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })() : (
        /* Empty state on desktop */
        <div className="desktop-only" style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '20px',
          color: 'var(--text-muted)', position: 'relative',
        }}>
          {/* Animated Background Mesh for empty state */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(at 50% 50%, rgba(124,58,237,0.08) 0px, transparent 60%)', zIndex: -1, animation: 'pulse-ring 4s infinite alternate' }} />
          
          <div style={{
            width: '96px', height: '96px', borderRadius: '30px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 2px 20px rgba(255,255,255,0.05)',
            position: 'relative', backdropFilter: 'blur(10px)',
          }}>
            💬
            <div style={{ position: 'absolute', top: -10, right: -10, background: 'var(--gradient-primary)', padding: '4px', borderRadius: '50%', border: '2px solid rgba(12,17,35,1)' }}>
              <Lock size={14} color="white" />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.02em' }}>Select a conversation</div>
            <div style={{ fontSize: '15px' }}>Choose a friend from the list to start messaging securely</div>
          </div>
        </div>
      )}
    </div>
  );
}
