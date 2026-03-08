'use client';
import { useAppStore } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mock-data';
import { Phone, Video, MicOff, VideoOff, Monitor, Camera, X, PhoneOff } from 'lucide-react';

export function CallOverlay() {
  const { callActive, callType, callPartnerId, endCall } = useAppStore();

  if (!callActive) return null;

  const partner = MOCK_USERS.find(u => u.id === callPartnerId);

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
            {partner?.avatar}
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
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Voice call • 02:34</div>
          </div>
        )}

        {/* Self view (video call) */}
        {callType === 'video' && (
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
            <button id="screen-share-btn" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <Monitor size={14} /> Screen Share
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
        <button id="mute-call-btn" style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><MicOff size={20} /></button>

        {callType === 'video' && (
          <button id="cam-toggle-btn" style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><VideoOff size={20} /></button>
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

        <button id="speaker-btn" style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>🔊</button>
      </div>
    </div>
  );
}
