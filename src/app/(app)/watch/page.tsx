'use client';
import { useState, useEffect } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Monitor, Mic, SkipForward,
  SkipBack, Users, Upload, Plus, Settings, Loader2, MessageCircle
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
  const [currentTime, setCurrentTime] = useState(1934);
  
  const totalTime = 6450;

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

  const mockChats = [
    { user: 'Marcus Wright', msg: 'This scene is absolutely incredible in 4K! 🎬', color: '#8b5cf6' },
    { user: 'You', msg: 'Wait for the twist coming in 5 minutes...', color: '#3b82f6' },
    { user: 'Sarah Jenkins', msg: "Don't spoil it! haha 😂", color: '#ec4899' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px',
        animation: 'fadeInUp 0.5s ease forwards',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6d28d9, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(109,40,217,0.3)',
            }}>
              <Play size={18} color="white" fill="white" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em' }}>Watch Cinema</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginLeft: '52px' }}>
            Watch movies together in real-time
          </p>
        </div>
      </div>

      {!inRoom ? (
        /* Room Selection */
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px',
          animation: 'fadeInUp 0.6s ease forwards',
        }}>
          {/* Create Room */}
          <button id="create-room-btn"
            onClick={() => setInRoom(true)}
            style={{
              background: 'rgba(12,17,35,0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px', padding: '36px 24px',
              cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
              position: 'relative', overflow: 'hidden',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(124,58,237,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04)'; }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(124,58,237,0.3)',
            }}>
              <Plus size={28} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>Create Room</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Start a new cinema room with a friend</div>
            </div>
          </button>

          {/* Join Room */}
          <div style={{
            background: 'rgba(12,17,35,0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '36px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(6,182,212,0.2)',
            }}>
              <Users size={28} color="white" />
            </div>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px' }}>Join Room</div>
              <input className="input-field" placeholder="Enter room code..." style={{ textAlign: 'center', fontSize: '13px', marginBottom: '12px', height: '46px' }} id="room-code-input" />
              <button className="btn-primary" style={{ width: '100%', fontSize: '13px', opacity: loading ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', height: '46px', borderRadius: '12px' }}
                onClick={handleJoin} id="join-room-btn" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Join Room'}
              </button>
            </div>
          </div>

          {/* Features */}
          <div style={{
            background: 'rgba(12,17,35,0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '28px 24px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}>
            <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'rgba(124,58,237,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>🎬</span>
              Cinema Features
            </div>
            {[
              { icon: '🎬', label: 'Upload any movie' },
              { icon: '⏯️', label: 'Synchronized playback' },
              { icon: '🎙️', label: 'Voice chat while watching' },
              { icon: '🖥️', label: 'Screen sharing support' },
              { icon: '🔊', label: 'System audio sharing' },
              { icon: '⚡', label: 'Real-time speed control' },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '13px',
                padding: '6px 0',
              }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px',
                }}>{icon}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Cinema Room */
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          {/* Movie title bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px',
            padding: '12px 18px',
            background: 'rgba(12,17,35,0.8)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px',
          }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>The Midnight Horizon</div>
              <div style={{ fontSize: '12px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                Live with 12 Friends
              </div>
            </div>
            <div style={{
              padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
              background: 'rgba(124,58,237,0.1)', color: 'var(--accent-violet)',
              border: '1px solid rgba(124,58,237,0.2)',
            }}>Cinema Mode</div>
          </div>

          {/* Video Player */}
          <div style={{
            background: '#000', borderRadius: '20px', overflow: 'hidden',
            position: 'relative', aspectRatio: '16/9', marginBottom: '16px',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 20px rgba(124,58,237,0.05)',
          }}>
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #05080f 0%, #1e1b4b 40%, #0f172a 70%, #05080f 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(124,58,237,0.3))' }}>🎬</div>
                <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Cinema Room Active</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>Upload a movie to start watching</div>
              </div>
            </div>

            {screenSharing && (
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                background: 'rgba(16,185,129,0.9)', backdropFilter: 'blur(8px)', borderRadius: '8px',
                padding: '4px 10px', fontSize: '12px', color: 'white', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <Monitor size={12} /> Screen Sharing Active
              </div>
            )}

            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '120px', height: '80px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #4c1d95, #1e3a8a)',
              border: '2px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}>🌸</div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px',
              cursor: 'pointer', position: 'relative',
            }} onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const newPercent = (e.clientX - rect.left) / rect.width;
              setCurrentTime(newPercent * totalTime);
            }}>
              <div style={{
                height: '100%', width: `${progressPercent}%`,
                background: 'var(--gradient-primary)', borderRadius: '5px',
                transition: playing ? 'width 1s linear' : 'width 0.1s',
                boxShadow: '0 0 10px rgba(124,58,237,0.3)',
              }} />
              <div style={{
                position: 'absolute', top: '50%', left: `${progressPercent}%`,
                transform: 'translate(-50%, -50%)',
                width: '14px', height: '14px', borderRadius: '50%',
                background: 'white', boxShadow: '0 0 10px rgba(124,58,237,0.5)',
                transition: 'transform 0.2s',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', fontFamily: 'Space Grotesk' }}>
              <span>{formatTime(currentTime)}</span><span>{formatTime(totalTime)}</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{
            background: 'rgba(12,17,35,0.8)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            flexWrap: 'wrap', marginBottom: '16px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button id="skip-back-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                <SkipBack size={20} />
              </button>
              <button id="play-pause-btn" onClick={() => setPlaying(!playing)} style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'var(--gradient-primary)', border: 'none', cursor: 'pointer',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(124,58,237,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>
                {playing ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
              </button>
              <button id="skip-fwd-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                <SkipForward size={20} />
              </button>
            </div>

            <button id="mute-btn" onClick={() => setMuted(!muted)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <div style={{ display: 'flex', gap: '4px' }}>
              {[0.5, 1, 1.5, 2].map((s) => (
                <button key={s} id={`speed-${s}`} onClick={() => setSpeed(s)} style={{
                  padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: speed === s ? 600 : 400,
                  background: speed === s ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${speed === s ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  color: speed === s ? 'var(--accent-violet)' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {s}x
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'screen-share-btn', icon: <Monitor size={13} />, label: screenSharing ? 'Sharing' : 'Share Screen', active: screenSharing, toggle: () => setScreenSharing(!screenSharing), activeColor: '#10b981' },
                { id: 'audio-share-btn', icon: <Volume2 size={13} />, label: 'Audio', active: audioSharing, toggle: () => setAudioSharing(!audioSharing), activeColor: '#3b82f6' },
                { id: 'voice-chat-btn', icon: <Mic size={13} />, label: voiceChat ? 'Voice On' : 'Voice', active: voiceChat, toggle: () => setVoiceChat(!voiceChat), activeColor: '#8b5cf6' },
              ].map(({ id, icon, label, active, toggle, activeColor }) => (
                <button key={id} id={id} onClick={toggle} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                  background: active ? `${activeColor}12` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? `${activeColor}30` : 'rgba(255,255,255,0.06)'}`,
                  color: active ? activeColor : 'var(--text-secondary)', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  {icon} {label}
                </button>
              ))}
              <button id="upload-movie-btn" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                background: 'var(--gradient-primary)', border: 'none', color: 'white', cursor: 'pointer',
                boxShadow: '0 0 15px rgba(124,58,237,0.2)',
              }}>
                <Upload size={13} /> Upload Movie
              </button>
            </div>
          </div>

          {/* Live Chat */}
          <div style={{
            background: 'rgba(12,17,35,0.8)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px', padding: '18px 20px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <MessageCircle size={14} style={{ color: 'var(--accent-violet)' }} /> Live Chat
            </div>
            {mockChats.map((chat, i) => (
              <div key={i} style={{
                display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${chat.color}, ${chat.color}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', color: 'white', fontWeight: 700, flexShrink: 0,
                }}>{chat.user[0]}</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: chat.color, marginBottom: '2px' }}>{chat.user}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{chat.msg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
