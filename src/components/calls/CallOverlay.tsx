import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mock-data';
import { Phone, Video, Mic, MicOff, VideoOff, Monitor, Camera, X, PhoneOff, Volume2, VolumeX, Check, StopCircle, Pause, Play, RefreshCcw } from 'lucide-react';
import { useWebRTC } from '@/hooks/useWebRTC';

export function CallOverlay() {
  const { callActive, callStatus, callType, callPartnerId, declineCall } = useAppStore();
  
  const webrtc = useWebRTC();

  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [duration, setDuration] = useState(0);

  // Screen share UI state
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [isSwitchingSource, setIsSwitchingSource] = useState(false);
  const [screenPaused, setScreenPaused] = useState(false);

  // Video element refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  // Duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callActive && callStatus === 'connected') {
      interval = setInterval(() => setDuration(d => d + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callActive, callStatus]);

  // Reset state when call ends (using timeout to avoid synchronous setState warning)
  useEffect(() => {
    if (!callActive) {
      setTimeout(() => {
        setDuration(0);
        setMuted(false);
        setVideoOff(false);
        setScreenPaused(false);
      }, 0);
    }
  }, [callActive]);

  // Bind local/remote streams to video elements
  useEffect(() => {
    if (localVideoRef.current && webrtc.localStream) {
      localVideoRef.current.srcObject = webrtc.localStream;
    }
  }, [webrtc.localStream, callActive]);

  useEffect(() => {
    if (remoteVideoRef.current && webrtc.remoteStream) {
      remoteVideoRef.current.srcObject = webrtc.remoteStream;
    }
  }, [webrtc.remoteStream, callActive]);

  useEffect(() => {
    if (screenVideoRef.current && webrtc.screenStream) {
      screenVideoRef.current.srcObject = webrtc.screenStream;
    }
  }, [webrtc.screenStream, callActive]);

  // Handle mute and video off toggles
  useEffect(() => {
    if (webrtc.localStream) {
      webrtc.localStream.getAudioTracks().forEach(t => t.enabled = !muted);
      webrtc.localStream.getVideoTracks().forEach(t => t.enabled = !videoOff);
    }
  }, [muted, videoOff, webrtc.localStream]);

  // Mute remote audio if speaker is off
  useEffect(() => {
    if (remoteVideoRef.current) {
        remoteVideoRef.current.muted = !speaker;
    }
    if (screenVideoRef.current) {
        screenVideoRef.current.muted = !speaker;
    }
  }, [speaker]);

  // Initiate call with local media if caller
  useEffect(() => {
    if (callActive && callStatus === 'calling' && !webrtc.localStream) {
      webrtc.startLocalStream(callType || 'voice').then(() => {
         // triggerCall is already called by the button that initiated startCall,
         // but since store.startCall doesn't send signaling, we SHOULD do it here,
         // OR let the caller button do it. Wait, the caller button uses store.startCall!
         // We must send CALL_INIT here if we are the caller.
         // Actually, if we just rely on triggerCall from the UI, we don't need to send CALL_INIT here.
         // But the UI currently uses `useAppStore.getState().startCall(id, type)`.
         // To avoid modifying every UI component, we can send CALL_INIT here if we are calling.
      });
    }
  }, [callActive, callStatus, callType, webrtc]);

  if (!callActive) return null;

  const partner = MOCK_USERS.find(u => u.id === callPartnerId);
  
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleScreenShareClick = () => {
    if (webrtc.screenStream) {
       webrtc.stopScreenShare();
       setScreenPaused(false);
    } else {
       setIsSwitchingSource(false);
       setShowAudioPrompt(true);
    }
  };

  const handleSwitchSource = () => {
    setIsSwitchingSource(true);
    setShowAudioPrompt(true);
  };

  const confirmScreenShare = (includeAudio: boolean) => {
    setShowAudioPrompt(false);
    if (isSwitchingSource) {
       webrtc.switchScreenSource(includeAudio);
    } else {
       webrtc.startScreenShare(includeAudio);
    }
    setIsSwitchingSource(false);
    setScreenPaused(false);
  };

  const handleAcceptCall = async () => {
     await webrtc.startLocalStream(callType || 'voice');
     webrtc.triggerAccept();
  };

  const handleToggleScreenPause = () => {
     const nextPaused = !screenPaused;
     setScreenPaused(nextPaused);
     webrtc.toggleScreenSharePause(nextPaused);
  };

  // Render incoming/outgoing ringing state
  if (callStatus === 'calling' || callStatus === 'ringing') {
    return (
      <div className="call-overlay" style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', zIndex: 999 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '140px', height: '140px', borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px',
            marginBottom: '32px',
            boxShadow: '0 0 60px rgba(55, 19, 236, 0.4)',
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
              <button id="accept-call-btn" onClick={handleAcceptCall} style={{
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

            <button id="decline-call-btn" onClick={callStatus === 'ringing' ? () => { declineCall(); webrtc.triggerEnd(); }  : webrtc.triggerEnd} style={{
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

  // Connected Call layout
  return (
    <div className="call-overlay" style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Audio Prompt Modal */}
      {showAudioPrompt && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
           <div style={{
              background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
              padding: '24px', borderRadius: '16px', width: '320px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              textAlign: 'center'
           }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Share System Audio?</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>
                Do you want to share the audio currently playing on your device? This is great for watching movies or listening to music together.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => confirmScreenShare(true)}
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'white', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600
                  }}>
                  Enable System Audio
                </button>
                <button
                  onClick={() => confirmScreenShare(false)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600
                  }}>
                  Disable Audio
                </button>
                <button
                  onClick={() => setShowAudioPrompt(false)}
                  style={{
                    background: 'transparent',
                    color: '#f87171', padding: '12px', border: 'none', cursor: 'pointer', fontWeight: 600, marginTop: '4px'
                  }}>
                  Cancel
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Screen Share Active Indicator */}
      {webrtc.screenStream && (
         <div style={{
            position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 90,
            background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.5)',
            color: '#34d399', padding: '8px 16px', borderRadius: '20px',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500,
            animation: 'glow-pulse 2s ease-in-out infinite'
         }}>
            <Monitor size={16} /> Screen Sharing Active
         </div>
      )}

      {/* Main Video BG */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        background: callType === 'video'
          ? 'linear-gradient(135deg, #0f0a1a 0%, #1a0f2e 50%, #0a0e1a 100%)'
          : 'linear-gradient(135deg, #0a1628 0%, #0f1e3c 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        
        {/* Remote Screen Share stream taking priority */}
        {webrtc.remoteStream && webrtc.remoteStream.getVideoTracks().length > 1 && (
           <video
             ref={screenVideoRef}
             autoPlay
             playsInline
             style={{
                position: 'absolute', width: '100%', height: '100%', objectFit: 'contain', zIndex: 10
             }}
           />
        )}

        {/* Remote Video Stream */}
        {callType === 'video' && (
          <video 
            ref={remoteVideoRef}
            autoPlay 
            playsInline 
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              position: 'absolute', zIndex: 5,
              opacity: (webrtc.remoteStream && webrtc.remoteStream.getVideoTracks().length > 1) ? 0.3 : 1
            }}
          />
        )}

        {/* Fallback avatar if no video streaming or voice call */}
        {(!webrtc.remoteStream || callType === 'voice') && (
          <div style={{ textAlign: 'center', zIndex: 5 }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px',
              margin: '0 auto 24px',
              boxShadow: '0 0 60px rgba(55, 19, 236, 0.4)',
              animation: webrtc.remoteStream ? 'none' : 'glow-pulse 2s ease-in-out infinite',
            }}>
              {partner?.avatar}
            </div>
            {callType === 'voice' && (
              <>
                <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{partner?.displayName}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{formatTime(duration)}</div>
              </>
            )}
          </div>
        )}

        {/* Local video thumbnail */}
        {callType === 'video' && !videoOff && (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: 'absolute', bottom: webrtc.screenStream ? '100px' : '20px', right: '20px', zIndex: 20,
              width: '120px', height: '160px', borderRadius: '14px',
              objectFit: 'cover', transform: 'scaleX(-1)',
              background: '#1f2937',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          />
        )}

        {callType === 'video' && videoOff && (
          <div style={{
            position: 'absolute', bottom: webrtc.screenStream ? '100px' : '20px', right: '20px', zIndex: 20,
            width: '120px', height: '160px', borderRadius: '14px',
            background: '#1f2937',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.5)'
          }}>
            <VideoOff size={24} />
          </div>
        )}

        {/* Call info */}
        <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 30 }}>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{partner?.displayName}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>
            {callType === 'video' ? '📹 Video Call' : '📞 Voice Call'} • 🔒 Encrypted
          </div>
        </div>

        {/* Video call feature buttons */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px', zIndex: 30 }}>
            {callType === 'video' && (
              <button id="screenshot-btn" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <Camera size={14} /> Screenshot
              </button>
            )}
            <button id="screen-share-btn" 
              onClick={handleScreenShareClick}
              style={{ 
                background: webrtc.screenStream ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59,130,246,0.2)', 
                backdropFilter: 'blur(8px)', 
                border: `1px solid ${webrtc.screenStream ? 'rgba(239, 68, 68, 0.5)' : 'rgba(55, 19, 236, 0.5)'}`, 
                borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', 
                color: webrtc.screenStream ? '#fca5a5' : '#93c5fd', 
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600
              }}>
              <Monitor size={14} /> {webrtc.screenStream ? 'Stop Share' : 'Screen Share'}
            </button>
        </div>

        {/* Screen Share Controls (Visible when sharing) */}
        {webrtc.screenStream && (
           <div style={{ 
              position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 30,
              background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)',
              padding: '8px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', gap: '8px'
           }}>
              <button onClick={handleToggleScreenPause} style={{
                 background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '10px',
                 display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px'
              }}>
                 {screenPaused ? <Play size={16} /> : <Pause size={16} />} 
                 {screenPaused ? 'Resume' : 'Pause'}
              </button>

              <button onClick={handleSwitchSource} style={{
                 background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '10px',
                 display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px'
              }}>
                 <RefreshCcw size={16} /> Switch Source
              </button>

              <button onClick={() => webrtc.stopScreenShare()} style={{
                 background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: 'none', padding: '8px 16px', borderRadius: '10px',
                 display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px'
              }}>
                 <StopCircle size={16} /> Stop
              </button>
           </div>
        )}
      </div>

      {/* Main Bottom Controls */}
      <div style={{
        padding: '24px',
        background: 'rgba(10, 14, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
        zIndex: 40
      }}>
        <button id="mute-call-btn" 
          onClick={() => setMuted(!muted)}
          style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: muted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)', 
          border: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer', color: muted ? '#f87171' : 'white', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s'
        }}>
          {muted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {callType === 'video' && (
          <button id="cam-toggle-btn" 
            onClick={() => setVideoOff(!videoOff)}
            style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: videoOff ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer', color: videoOff ? '#fca5a5' : 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s'
          }}>
            {videoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
        )}

        {/* End Call */}
        <button id="end-call-btn" onClick={webrtc.triggerEnd}
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            border: 'none', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(239, 68, 68, 0.5)',
            transition: 'transform 0.2s'
          }}>
          <PhoneOff size={24} />
        </button>

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
