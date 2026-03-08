'use client';
import { useState, useEffect } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Monitor, Mic, SkipForward,
  SkipBack, Users, Upload, Plus, Settings, Loader2
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
  const [currentTime, setCurrentTime] = useState(1934); // Start at 32:14
  
  const totalTime = 6450; // 1:47:30

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

  return (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Watch Cinema 🎬</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Watch movies together in real-time
          </p>
        </div>
      </div>

      {!inRoom ? (
        /* Room Selection */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Create Room */}
          <button id="create-room-btn"
            onClick={() => setInRoom(true)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: '20px', padding: '32px 24px',
              cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-violet)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
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
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '20px', padding: '32px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={28} color="white" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>Join Room</div>
              <input className="input-field" placeholder="Enter room code..." style={{ textAlign: 'center', fontSize: '13px', marginBottom: '10px' }} id="room-code-input" />
              <button className="btn-primary" style={{ width: '100%', fontSize: '13px', opacity: loading ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onClick={handleJoin} id="join-room-btn" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Join Room'}
              </button>
            </div>
          </div>

          {/* Features Info */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '20px', padding: '24px',
          }}>
            <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Cinema Features</div>
            {[
              { icon: '🎬', label: 'Upload any movie' },
              { icon: '⏯️', label: 'Synchronized playback' },
              { icon: '🎙️', label: 'Voice chat while watching' },
              { icon: '🖥️', label: 'Screen sharing support' },
              { icon: '🔊', label: 'System audio sharing' },
              { icon: '⚡', label: 'Real-time speed control' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '13px' }}>
                <span>{icon}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Cinema Room */
        <div>
          {/* Video Player */}
          <div style={{
            background: '#000', borderRadius: '20px', overflow: 'hidden',
            position: 'relative', aspectRatio: '16/9', marginBottom: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 0 40px rgba(0,0,0,0.6)',
          }}>
            {/* Fake video */}
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #0a0e1a 0%, #1e1b4b 50%, #0a0e1a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎬</div>
                <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Cinema Room Active</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>Upload a movie to start watching</div>
              </div>
            </div>

            {/* Screen share overlay */}
            {screenSharing && (
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                background: 'rgba(16,185,129,0.9)', borderRadius: '8px',
                padding: '4px 10px', fontSize: '12px', color: 'white', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <Monitor size={12} /> Screen Sharing Active
              </div>
            )}

            {/* Friend mini view */}
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '120px', height: '80px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #4c1d95, #1e3a8a)',
              border: '2px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
            }}>🌸</div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{
              height: '5px', background: 'var(--bg-glass)', borderRadius: '5px',
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
              }} />
              <div style={{
                position: 'absolute', top: '50%', left: `${progressPercent}%`,
                transform: 'translate(-50%, -50%)',
                width: '12px', height: '12px', borderRadius: '50%',
                background: 'white', boxShadow: '0 0 6px rgba(124,58,237,0.5)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
              <span>{formatTime(currentTime)}</span><span>{formatTime(totalTime)}</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '16px', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            flexWrap: 'wrap',
          }}>
            {/* Playback */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button id="skip-back-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                <SkipBack size={20} />
              </button>
              <button id="play-pause-btn"
                onClick={() => setPlaying(!playing)}
                style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'var(--gradient-primary)', border: 'none', cursor: 'pointer',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--shadow-glow)',
                }}>
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button id="skip-fwd-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                <SkipForward size={20} />
              </button>
            </div>

            {/* Volume */}
            <button id="mute-btn" onClick={() => setMuted(!muted)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Speed Control */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[0.5, 1, 1.5, 2].map((s) => (
                <button key={s} id={`speed-${s}`}
                  onClick={() => setSpeed(s)}
                  style={{
                    padding: '4px 10px', borderRadius: '8px', fontSize: '12px',
                    background: speed === s ? 'rgba(124,58,237,0.2)' : 'var(--bg-glass)',
                    border: `1px solid ${speed === s ? 'var(--accent-violet)' : 'var(--border-color)'}`,
                    color: speed === s ? 'var(--accent-violet)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}>
                  {s}x
                </button>
              ))}
            </div>

            {/* Feature Toggles */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button id="screen-share-btn"
                onClick={() => setScreenSharing(!screenSharing)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                  background: screenSharing ? 'rgba(16,185,129,0.15)' : 'var(--bg-glass)',
                  border: `1px solid ${screenSharing ? 'rgba(16,185,129,0.3)' : 'var(--border-color)'}`,
                  color: screenSharing ? '#10b981' : 'var(--text-secondary)', cursor: 'pointer',
                }}>
                <Monitor size={13} /> {screenSharing ? 'Sharing' : 'Share Screen'}
              </button>
              <button id="audio-share-btn"
                onClick={() => setAudioSharing(!audioSharing)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                  background: audioSharing ? 'rgba(59,130,246,0.15)' : 'var(--bg-glass)',
                  border: `1px solid ${audioSharing ? 'rgba(59,130,246,0.3)' : 'var(--border-color)'}`,
                  color: audioSharing ? '#3b82f6' : 'var(--text-secondary)', cursor: 'pointer',
                }}>
                <Volume2 size={13} /> Audio
              </button>
              <button id="voice-chat-btn"
                onClick={() => setVoiceChat(!voiceChat)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                  background: voiceChat ? 'rgba(139,92,246,0.15)' : 'var(--bg-glass)',
                  border: `1px solid ${voiceChat ? 'rgba(139,92,246,0.3)' : 'var(--border-color)'}`,
                  color: voiceChat ? 'var(--accent-violet)' : 'var(--text-secondary)', cursor: 'pointer',
                }}>
                <Mic size={13} /> {voiceChat ? 'Voice On' : 'Voice'}
              </button>
              <button id="upload-movie-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                  background: 'var(--gradient-primary)', border: 'none', color: 'white', cursor: 'pointer',
                }}>
                <Upload size={13} /> Upload Movie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
