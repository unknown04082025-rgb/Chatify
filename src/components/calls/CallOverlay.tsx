import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mock-data';
import { Phone, Video, Mic, MicOff, VideoOff, Monitor, Camera, X, PhoneOff, Volume2, VolumeX, Check } from 'lucide-react';

export function CallOverlay() {
  const { callActive, callStatus, callType, callPartnerId, endCall, acceptCall, declineCall, shouldConnectCall } = useAppStore();
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callActive && callStatus === 'connected') {
      interval = setInterval(() => setDuration(d => d + 1), 1000);
    } else {
      setDuration(0);
      setMuted(false);
      setVideoOff(false);
      setScreenShare(false);
    }
    return () => clearInterval(interval);
  }, [callActive, callStatus]);

  useEffect(() => {
    if (callStatus === 'calling') {
      const timer = setTimeout(() => {
        shouldConnectCall();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [callStatus, shouldConnectCall]);

  if (!callActive) return null;

  const partner = MOCK_USERS.find(u => u.id === callPartnerId);
  
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (callStatus === 'calling' || callStatus === 'ringing') {
    return (
      <div className="call-overlay" style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', zIndex: 999 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '140px', height: '140px', borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px',
            marginBottom: '32px',
            boxShadow: '0 0 60px rgba(124,58,237,0.4)',
            animation: callStatus === 'ringing' ? 'glow-pulse 1s ease-in-out infinite' : 'bounce-dot 1.5s infinite alternate',
          }}>
            {partner?.avatar}
          </div>
          
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{partner?.displayName}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '48px' }}>
            {callStatus === 'ringing' 
              ? `Incoming ${callType} call...` 
              : `Calling...`}
          </p>

          <div style={{ display: 'flex', gap: '32px' }}>
            {callStatus === 'ringing' && (
              <button id="accept-call-btn" onClick={acceptCall} style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none', cursor: 'pointer', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 24px rgba(16, 185, 129, 0.5)',
                animation: 'bounce-dot 2s infinite'
              }}>
                <Check size={32} />
              </button>
            )}

            <button id="decline-call-btn" onClick={callStatus === 'ringing' ? declineCall : endCall} style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none', cursor: 'pointer', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(239, 68, 68, 0.5)',
            }}>
              <X size={32} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="call-overlay" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Video BG */}
      <div style={{
        flex: 1, position: 'relative',
        background: callType === 'video'
          ? 'linear-gradient(135deg, #0f0a1a 0%, #1a0f2e 50%, #0a0e1a 100%)'
          : 'linear-gradient(135deg, #0a1628 0%, #0f1e3c 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {callType === 'video' && (
          /* Friend's video feed (simulated) */
          <div style={{
            width: '200px', height: '300px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #4c1d95, #1e3a8a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px',
            boxShadow: '0 0 60px rgba(124,58,237,0.3)',
          }}>
            {screenShare ? <Monitor size={64} style={{opacity: 0.5}} /> : partner?.avatar}
          </div>
        )}

        {callType === 'voice' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px',
              margin: '0 auto 24px',
              boxShadow: '0 0 60px rgba(124,58,237,0.4)',
              animation: 'glow-pulse 2s ease-in-out infinite',
            }}>
              {partner?.avatar}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{partner?.displayName}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{formatTime(duration)}</div>
          </div>
        )}

        {/* Self view (video call) */}
        {callType === 'video' && !videoOff && (
          <div style={{
            position: 'absolute', bottom: '100px', right: '20px',
            width: '100px', height: '140px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #1e3a8a, #0f766e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
            border: '2px solid rgba(255,255,255,0.2)',
          }}>
            {useAppStore.getState().currentUser?.avatar}
          </div>
        )}
        {callType === 'video' && videoOff && (
          <div style={{
            position: 'absolute', bottom: '100px', right: '20px',
            width: '100px', height: '140px', borderRadius: '14px',
            background: '#1f2937',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.5)'
          }}>
            <VideoOff size={24} />
          </div>
        )}

        {/* Call info */}
        <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{partner?.displayName}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>
            {callType === 'video' ? '📹 Video Call' : '📞 Voice Call'} • 🔒 Encrypted
          </div>
        </div>

        {/* Video call feature buttons */}
        {callType === 'video' && (
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
            <button id="screenshot-btn" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <Camera size={14} /> Screenshot
            </button>
            <button id="screen-share-btn" 
              onClick={() => setScreenShare(!screenShare)}
              style={{ 
                background: screenShare ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(8px)', 
                border: `1px solid ${screenShare ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.15)'}`, 
                borderRadius: '10px', padding: '8px', cursor: 'pointer', 
                color: screenShare ? '#93c5fd' : 'white', 
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' 
              }}>
              <Monitor size={14} /> {screenShare ? 'Sharing...' : 'Screen Share'}
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        padding: '24px',
        background: 'rgba(10, 14, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
      }}>
        <button id="mute-call-btn" 
          onClick={() => setMuted(!muted)}
          style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: muted ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', 
          border: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer', color: muted ? '#f87171' : 'white', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {muted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {callType === 'video' && (
          <button id="cam-toggle-btn" 
            onClick={() => setVideoOff(!videoOff)}
            style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: videoOff ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer', color: videoOff ? '#f87171' : 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {videoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
        )}

        {/* End Call */}
        <button id="end-call-btn" onClick={endCall}
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            border: 'none', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(239, 68, 68, 0.5)',
          }}>
          <PhoneOff size={24} />
        </button>

        {callType === 'video' && (
          <button id="fullscreen-btn" style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Monitor size={20} /></button>
        )}

        <button id="speaker-btn" 
          onClick={() => setSpeaker(!speaker)}
          style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: !speaker ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', 
          border: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer', color: 'white', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {speaker ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>
    </div>
  );
}
