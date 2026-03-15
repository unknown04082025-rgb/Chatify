import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { signaling, SignalMessage } from '@/lib/webrtc';

export function useWebRTC() {
  const { currentUser, callActive, callStatus, callPartnerId, receiveCall, acceptCall, endCall } = useAppStore();
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (currentUser?.id) {
      signaling.setUserId(currentUser.id);
    }
  }, [currentUser?.id]);

  const initConnection = useCallback(async (isInitiator: boolean) => {
    const pc = new RTCPeerConnection({
       iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    peerConnection.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate && callPartnerId) {
        signaling.send({
          type: 'ICE_CANDIDATE',
          targetId: callPartnerId,
          data: { candidate: event.candidate }
        });
      }
    };

    pc.ontrack = (event) => {
      const { track, streams } = event;
      if (streams && streams[0]) {
        setRemoteStream(prev => {
           if (prev && prev.id === streams[0].id) {
              if (prev.getTracks().find(t => t.id === track.id)) return prev;
              const newStream = new MediaStream(prev);
              newStream.addTrack(track);
              return newStream;
           }
           return streams[0];
        });
      } else {
        setRemoteStream(prev => {
          if (prev) {
            prev.addTrack(track);
            return prev;
          }
          return new MediaStream([track]);
        });
      }
    };

    pc.onnegotiationneeded = async () => {
      try {
        if (isInitiator) {
           const offer = await pc.createOffer();
           await pc.setLocalDescription(offer);
           if (callPartnerId && pc.localDescription) {
             signaling.send({
               type: 'OFFER',
               targetId: callPartnerId,
               data: { sdp: pc.localDescription }
             });
           }
        }
      } catch (err) {
        console.error('Error negotiating', err);
      }
    };

    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }
  }, [callPartnerId, localStream]);

  const handleOffer = useCallback(async (sdp: RTCSessionDescriptionInit) => {
    if (!peerConnection.current) {
      await initConnection(false);
    }
    const pc = peerConnection.current!;
    if (pc.signalingState !== 'stable') return;
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    if (callPartnerId && pc.localDescription) {
      signaling.send({
        type: 'ANSWER',
        targetId: callPartnerId,
        data: { sdp: pc.localDescription }
      });
    }
  }, [callPartnerId, initConnection]);

  const handleAnswer = useCallback(async (sdp: RTCSessionDescriptionInit) => {
    if (peerConnection.current && peerConnection.current.signalingState !== 'stable') {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
    }
  }, []);

  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    if (peerConnection.current && peerConnection.current.remoteDescription) {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('Error adding received ice candidate', e);
      }
    }
  }, []);

  const cleanup = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      setLocalStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    setRemoteStream(null);
  }, [localStream, screenStream]);

  // Handle incoming signals
  useEffect(() => {
    const handleSignal = async (msg: SignalMessage) => {
      switch (msg.type) {
        case 'CALL_INIT':
          if (!callActive && msg.data?.type) {
            receiveCall(msg.senderId, msg.data.type);
          }
          break;
        case 'CALL_ACCEPT':
          if (callStatus === 'calling' && msg.senderId === callPartnerId) {
            acceptCall();
            await initConnection(true);
          }
          break;
        case 'CALL_DECLINE':
        case 'CALL_END':
          if (msg.senderId === callPartnerId) {
            cleanup();
            endCall();
          }
          break;
        case 'OFFER':
          if (msg.senderId === callPartnerId && msg.data?.sdp) await handleOffer(msg.data.sdp);
          break;
        case 'ANSWER':
          if (msg.senderId === callPartnerId && msg.data?.sdp) await handleAnswer(msg.data.sdp);
          break;
        case 'ICE_CANDIDATE':
          if (msg.senderId === callPartnerId && msg.data?.candidate) await handleIceCandidate(msg.data.candidate);
          break;
      }
    };

    const unsubscribe = signaling.onMessage(handleSignal);
    return () => unsubscribe();
  }, [callActive, callStatus, callPartnerId, receiveCall, acceptCall, endCall, cleanup, handleOffer, handleAnswer, handleIceCandidate, initConnection]);

  const triggerCall = (partnerId: string, type: 'video' | 'voice') => {
     useAppStore.getState().startCall(partnerId, type);
     signaling.send({
        type: 'CALL_INIT',
        targetId: partnerId,
        data: { type }
     });
  };

  const triggerAccept = async () => {
     acceptCall();
     if (callPartnerId) {
       signaling.send({
         type: 'CALL_ACCEPT',
         targetId: callPartnerId
       });
       await initConnection(false);
     }
  };

  const triggerEnd = () => {
     if (callPartnerId && callActive) {
       signaling.send({
          type: 'CALL_END',
          targetId: callPartnerId
       });
     }
     cleanup();
     endCall();
  };

  const startScreenShare = async (includeAudio: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: includeAudio ? {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        } : false
      });
      setScreenStream(stream);

      if (peerConnection.current) {
        stream.getTracks().forEach(track => {
          track.onended = () => {
            stopScreenShare();
          };
          peerConnection.current!.addTrack(track, stream);
        });
      }
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const stopScreenShare = useCallback(() => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => {
        track.stop();
      });
      setScreenStream(null);
    }
  }, [screenStream]);

  const toggleScreenSharePause = (paused: boolean) => {
    if (screenStream) {
      screenStream.getVideoTracks().forEach(track => {
        track.enabled = !paused;
      });
    }
  };

  const switchScreenSource = async (includeAudio: boolean) => {
    stopScreenShare();
    await startScreenShare(includeAudio);
  };

  const startLocalStream = async (type: 'video' | 'voice') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === 'video',
        audio: true
      });
      setLocalStream(stream);
      return stream;
    } catch (e) {
      console.error('Failed to get local stream', e);
      return null;
    }
  };

  return {
     localStream,
     remoteStream,
     screenStream,
     setLocalStream,
     triggerCall,
     triggerAccept,
     triggerEnd,
     startScreenShare,
     stopScreenShare,
     toggleScreenSharePause,
     switchScreenSource,
     startLocalStream
  };
}
