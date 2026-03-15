export type SignalType = 'CALL_INIT' | 'CALL_ACCEPT' | 'CALL_DECLINE' | 'CALL_END' | 'OFFER' | 'ANSWER' | 'ICE_CANDIDATE';

export interface SignalMessage {
  type: SignalType;
  senderId: string;
  targetId: string;
  data?: {
    type?: 'video' | 'voice';
    sdp?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
  };
}

class WebRTCSignaling {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(msg: SignalMessage) => void> = new Set();
  public localUserId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.channel = new BroadcastChannel('chatify_webrtc_signaling');
      this.channel.onmessage = (event) => {
        const msg = event.data as SignalMessage;
        if (msg.targetId === this.localUserId || msg.targetId === 'ALL') {
           this.listeners.forEach(l => l(msg));
        }
      };
    }
  }

  public setUserId(id: string) {
    this.localUserId = id;
  }

  public send(msg: Omit<SignalMessage, 'senderId'>) {
    if (!this.localUserId || !this.channel) return;
    this.channel.postMessage({
      ...msg,
      senderId: this.localUserId,
    });
  }

  public onMessage(callback: (msg: SignalMessage) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const signaling = new WebRTCSignaling();
