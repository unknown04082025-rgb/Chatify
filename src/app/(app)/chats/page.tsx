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
  MicOff, Square,
} from 'lucide-react';

// ─── Typing Indicator ────────────────────────────────
function TypingIndicator({ isTyping }: { isTyping: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0' }}>
      <div style={{
        width: '10px', height: '10px', borderRadius: '50%',
        background: 'var(--accent-violet)',
        boxShadow: '0 0 6px rgba(139, 92, 246, 0.6)',
        animation: isTyping ? 'bounce-dot 0.6s infinite alternate' : 'none',
        transition: 'all 0.3s',
        transform: isTyping ? undefined : 'scale(1)',
      }} />
      {isTyping && (
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>typing...</span>
      )}
    </div>
  );
}

// ─── Wave bars for voice ──────────────────────────────
function VoiceWaveform({ bars = 8 }: { bars?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '24px' }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} className="wave-bar" style={{
          height: `${Math.random() * 16 + 6}px`,
          animationDelay: `${i * 0.1}s`,
          animationDuration: `${0.4 + Math.random() * 0.3}s`,
        }} />
      ))}
    </div>
  );
}

export default function ChatsPage() {
  const router = useRouter();
  const { chats, messages, activeChatId, setActiveChat, sendMessage, setTyping, typingUsers, currentUser, startCall } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [msgType, setMsgType] = useState<'normal' | 'after-view' | 'timed-delete'>('normal');
  const [isRecording, setIsRecording] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [search, setSearch] = useState('');
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
    // Simulate friend reply after delay
    setTimeout(() => {
      const replies = ['Got it! 😊', 'That\'s great!', '🔥🔥🔥', 'Sure thing!', 'Interesting...', '👍'];
      setTyping(activeChatId!, true);
      setTimeout(() => {
        setTyping(activeChatId!, false);
      }, 2000);
    }, 500);
  };

  const filteredChats = chats.filter((c) => {
    const other = getOtherUser(c);
    return other?.username.includes(search) || other?.displayName.toLowerCase().includes(search.toLowerCase());
  });

  const msgTypeConfig = {
    normal: { icon: <Send size={14} />, label: 'Normal', color: 'var(--accent-violet)' },
    'after-view': { icon: <Eye size={14} />, label: 'After-view', color: '#f59e0b' },
    'timed-delete': { icon: <Trash2 size={14} />, label: 'Delete in 3h', color: '#ef4444' },
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--nav-height))', overflow: 'hidden' }}>

      {/* ── Sidebar: Chat List ── */}
      <div
        className={activeChatId ? 'desktop-only' : ''}
        style={{
          width: activeChatId ? undefined : '100%',
          minWidth: '320px',
          maxWidth: '320px',
          borderRight: '1px solid var(--border-color)',
          display: activeChatId ? 'none' : 'flex',
          flexDirection: 'column',
          background: 'var(--bg-secondary)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Chats</h2>
            <div className="encrypt-badge">🔒 E2E</div>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="input-field" style={{ paddingLeft: '38px', fontSize: '13px' }}
              placeholder="Search chats..." value={search} onChange={(e) => setSearch(e.target.value)} id="chats-search" />
          </div>
        </div>

        {/* Chat List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {filteredChats.map((chat) => {
            const other = getOtherUser(chat);
            if (!other) return null;
            return (
              <button key={chat.id} id={`chat-item-${chat.id}`}
                onClick={() => setActiveChat(chat.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '12px',
                  background: activeChatId === chat.id ? 'rgba(124,58,237,0.12)' : 'transparent',
                  border: activeChatId === chat.id ? '1px solid rgba(124,58,237,0.2)' : '1px solid transparent',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                }}
                onMouseEnter={(e) => { if (activeChatId !== chat.id) e.currentTarget.style.background = 'var(--bg-glass)'; }}
                onMouseLeave={(e) => { if (activeChatId !== chat.id) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px',
                  }}>{other.avatar}</div>
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: other.status === 'available' ? '#10b981' : '#475569',
                    border: '2px solid var(--bg-secondary)',
                  }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{other.displayName}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {chat.lastMessage ? formatRelativeTime(chat.lastMessage.timestamp) : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <span style={{
                      fontSize: '12px', color: 'var(--text-muted)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px',
                    }}>
                      {chat.isTyping ? '⌨️ typing...' : (chat.lastMessage?.content || 'No messages yet')}
                    </span>
                    {chat.unreadCount > 0 && (
                      <div style={{
                        minWidth: '20px', height: '20px', borderRadius: '10px',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700, color: 'white', padding: '0 6px',
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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Chat Header */}
            <div style={{
              padding: '12px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'var(--bg-secondary)',
            }}>
              <button className="mobile-only" onClick={() => setActiveChat(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                <ChevronLeft size={20} />
              </button>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>{other.avatar}</div>
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '11px', height: '11px', borderRadius: '50%',
                  background: other.status === 'available' ? '#10b981' : '#475569',
                  border: '2px solid var(--bg-secondary)',
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{other.displayName}</div>
                <div style={{ fontSize: '12px' }}>
                  {isTyping
                    ? <TypingIndicator isTyping={true} />
                    : <span className={other.status === 'available' ? 'status-available' : 'status-not-available'} style={{ fontSize: '12px' }}>
                      {other.status === 'available' ? '● Available' : '○ Not Available'}
                    </span>
                  }
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button id="voice-call-btn" onClick={() => startCall(other.id, 'voice')}
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#10b981', display: 'flex' }}>
                  <Phone size={16} />
                </button>
                <button id="video-call-btn" onClick={() => startCall(other.id, 'video')}
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#3b82f6', display: 'flex' }}>
                  <Video size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatMessages.map((msg) => {
                const isSelf = msg.senderId === currentUser?.id;
                const sender = MOCK_USERS.find((u) => u.id === msg.senderId);
                return (
                  <div key={msg.id} style={{
                    display: 'flex',
                    justifyContent: isSelf ? 'flex-end' : 'flex-start',
                    gap: '8px', alignItems: 'flex-end',
                  }}>
                    {!isSelf && (
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', flexShrink: 0,
                      }}>{sender?.avatar}</div>
                    )}
                    <div style={{
                      maxWidth: '72%',
                      background: isSelf ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                      border: isSelf ? 'none' : '1px solid var(--border-color)',
                      borderRadius: isSelf ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      padding: msg.type === 'voice' ? '10px 16px' : '10px 14px',
                    }}>
                      {/* Message body */}
                      {msg.type === 'voice' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Mic size={14} />
                          <VoiceWaveform bars={10} />
                          <span style={{ fontSize: '12px', opacity: 0.8 }}>{msg.content}</span>
                        </div>
                      ) : msg.type === 'after-view' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Eye size={13} style={{ opacity: 0.7 }} />
                          <span style={{ fontSize: '14px' }}>{msg.content}</span>
                          <span style={{ fontSize: '10px', opacity: 0.6, background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '6px' }}>After-view</span>
                        </div>
                      ) : msg.type === 'timed-delete' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Trash2 size={13} style={{ opacity: 0.7 }} />
                          <span style={{ fontSize: '14px' }}>{msg.content}</span>
                          <span style={{ fontSize: '10px', opacity: 0.6, background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '6px' }}>Deletes in 3h</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '14px', lineHeight: 1.5 }}>{msg.content}</span>
                      )}

                      {/* Timestamp + encrypt */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '4px', alignItems: 'center' }}>
                        {msg.encrypted && <Lock size={9} style={{ opacity: 0.5 }} />}
                        <span style={{ fontSize: '10px', opacity: 0.6 }}>{formatMessageTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator from friend */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                    {other.avatar}
                  </div>
                  <div style={{
                    background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                    borderRadius: '18px 18px 18px 4px', padding: '12px 16px',
                    display: 'flex', gap: '4px', alignItems: 'center',
                  }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div key={i} style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: 'var(--accent-violet)',
                        animation: `bounce-dot 0.8s ${delay}s infinite alternate`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
            }}>
              {/* Message Type Selector */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                {(Object.keys(msgTypeConfig) as Array<keyof typeof msgTypeConfig>).map((type) => (
                  <button key={type} id={`msg-type-${type}`}
                    onClick={() => setMsgType(type)}
                    style={{
                      padding: '4px 10px', borderRadius: '8px', fontSize: '11px',
                      fontWeight: msgType === type ? 600 : 400,
                      background: msgType === type ? `rgba(124,58,237,0.15)` : 'transparent',
                      border: `1px solid ${msgType === type ? 'var(--accent-violet)' : 'var(--border-color)'}`,
                      color: msgType === type ? 'var(--accent-violet)' : 'var(--text-muted)',
                      cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                    {msgTypeConfig[type].icon}
                    {msgTypeConfig[type].label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                {/* Attachment buttons */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button id="snap-btn" title="Send Snap"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#f59e0b', display: 'flex' }}>
                    <Zap size={16} />
                  </button>
                  <button id="image-btn" title="Send Image"
                    style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                    <Image size={16} />
                  </button>
                </div>

                <input type="text" className="input-field" id="chat-input"
                  placeholder="Type an encrypted message..."
                  value={inputText}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                  style={{ flex: 1 }}
                />

                {/* Voice + Send */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {inputText ? (
                    <button id="send-btn" onClick={handleSend}
                      style={{ background: 'var(--gradient-primary)', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer', color: 'white', display: 'flex', boxShadow: 'var(--shadow-glow)' }}>
                      <Send size={16} />
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
                        border: 'none', borderRadius: '10px', padding: '10px',
                        cursor: 'pointer', color: 'white', display: 'flex',
                        transition: 'all 0.2s',
                        boxShadow: isRecording ? '0 0 20px rgba(239,68,68,0.5)' : 'var(--shadow-glow)',
                      }}>
                      {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
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
          alignItems: 'center', justifyContent: 'center', gap: '16px',
          color: 'var(--text-muted)',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '20px',
            background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
          }}>💬</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Select a chat</div>
            <div style={{ fontSize: '14px' }}>Choose a conversation from the list</div>
          </div>
        </div>
      )}
    </div>
  );
}
