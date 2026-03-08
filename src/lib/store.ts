'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Message, Chat, FriendRequest } from './types';
import { MOCK_USERS, MOCK_MESSAGES, MOCK_CHATS, MOCK_FRIEND_REQUESTS } from './mock-data';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  pendingEmail: string;
  // Auth stage: 'signup' | 'needs-otp' | 'authenticated'
  authStage: 'idle' | 'needs-otp' | 'authenticated';
}

interface ChatState {
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChatId: string | null;
  typingUsers: Record<string, boolean>;
}

interface UIState {
  activeSection: 'chats' | 'stories' | 'watch' | 'vault' | 'memories';
  vaultUnlocked: boolean;
  snapViewerOpen: boolean;
  callActive: boolean;
  callStatus: 'idle' | 'calling' | 'ringing' | 'connected';
  callType: 'voice' | 'video' | null;
  callPartnerId: string | null;
}

interface AppStore extends AuthState, ChatState, UIState {
  // Auth actions
  signUp: (user: Partial<User>, password: string) => void;
  login: (email: string, password: string) => 'needs-otp' | 'authenticated' | 'error';
  adminLogin: (password: string) => boolean;
  verifyOTP: (otp: string) => boolean;
  logout: () => void;
  setPendingEmail: (email: string) => void;

  // Friend actions
  friendRequests: FriendRequest[];
  sendFriendRequest: (receiverId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;

  // Chat actions
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (chatId: string, content: string, type?: Message['type']) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;

  // UI actions
  setSection: (section: UIState['activeSection']) => void;
  unlockVault: (pin: string) => boolean;
  lockVault: () => void;
  startCall: (partnerId: string, type: 'voice' | 'video') => void;
  shouldConnectCall: () => void;
  receiveCall: (partnerId: string, type: 'voice' | 'video') => void;
  acceptCall: () => void;
  declineCall: () => void;
  endCall: () => void;
}

// Demo registered users: simulate already-registered users
const REGISTERED_USERS: Record<string, { user: User; password: string }> = {
  'priya@chatify.io': { user: MOCK_USERS.find(u => u.email === 'priya@chatify.io')!, password: 'demo123' },
  'rahul@chatify.io': { user: MOCK_USERS.find(u => u.email === 'rahul@chatify.io')!, password: 'demo123' },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Auth initial state
      currentUser: null,
      isAuthenticated: false,
      pendingEmail: '',
      authStage: 'idle',

      // Friend initial state
      friendRequests: MOCK_FRIEND_REQUESTS,

      // Chat initial state
      chats: MOCK_CHATS,
      messages: { 'chat-1': MOCK_MESSAGES, 'chat-2': [] },
      activeChatId: null,
      typingUsers: {},

      // UI initial state
      activeSection: 'chats',
      vaultUnlocked: false,
      snapViewerOpen: false,
      callActive: false,
      callStatus: 'idle',
      callType: null,
      callPartnerId: null,

      // Auth actions
      setPendingEmail: (email) => set({ pendingEmail: email }),

      signUp: (userData, _password) => {
        const newUser: User = {
          id: `user-${Date.now()}`,
          username: userData.username || 'newuser',
          email: userData.email || '',
          displayName: userData.displayName || userData.username || 'New User',
          avatar: userData.avatar || '👤',
          type: 'normal',
          status: 'available',
          joinedDate: new Date().toISOString().split('T')[0],
          loginCount: 0,
          emailVerified: false,
          lastSeen: 'now',
        };
        // Store in runtime (would be DB call in real app)
        REGISTERED_USERS[newUser.email] = { user: newUser, password: _password };
        set({ currentUser: newUser, isAuthenticated: true, authStage: 'authenticated' });
      },

      login: (email, _password) => {
        const record = REGISTERED_USERS[email];
        if (!record) return 'error';

        const user = { ...record.user };

        if (user.loginCount === 0) {
          // First login after signup → needs OTP
          user.loginCount = 1;
          REGISTERED_USERS[email].user.loginCount = 1;
          set({ pendingEmail: email, authStage: 'needs-otp', currentUser: user });
          return 'needs-otp';
        }

        // loginCount >= 1 and email verified → normal login
        if (!user.emailVerified && user.loginCount === 1) {
          // Second login but OTP not yet done for this session
          user.loginCount = 1;
          set({ pendingEmail: email, authStage: 'needs-otp', currentUser: user });
          return 'needs-otp';
        }

        // loginCount >= 1 and email verified → direct login
        user.loginCount += 1;
        REGISTERED_USERS[email].user.loginCount = user.loginCount;
        set({ currentUser: user, isAuthenticated: true, authStage: 'authenticated' });
        return 'authenticated';
      },

      adminLogin: (password) => {
        if (password === 'admin123') {
          const adminUser: User = {
            id: 'admin-1',
            username: 'chatify_admin',
            email: 'admin@chatify.io',
            displayName: 'System Admin',
            avatar: '🛡️',
            type: 'admin',
            status: 'available',
            joinedDate: '2023-12-01',
            loginCount: 100,
            emailVerified: true,
            lastSeen: 'now',
          };
          set({ currentUser: adminUser, isAuthenticated: true, authStage: 'authenticated' });
          return true;
        }
        return false;
      },

      verifyOTP: (_otp) => {
        // In real app, validate against server-sent OTP
        // Demo: any 6-digit code works
        if (_otp.length === 6) {
          const { currentUser, pendingEmail } = get();
          if (currentUser) {
            const verified = { ...currentUser, emailVerified: true, loginCount: (currentUser.loginCount || 0) + 1 };
            if (REGISTERED_USERS[pendingEmail]) {
              REGISTERED_USERS[pendingEmail].user.emailVerified = true;
              REGISTERED_USERS[pendingEmail].user.loginCount = verified.loginCount;
            }
            set({ currentUser: verified, isAuthenticated: true, authStage: 'authenticated' });
            return true;
          }
        }
        return false;
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          authStage: 'idle',
          activeChatId: null,
          vaultUnlocked: false,
        });
      },

      // Friend actions
      sendFriendRequest: (receiverId) => {
        const { currentUser, friendRequests } = get();
        if (!currentUser) return;
        const newReq: FriendRequest = {
          id: `req-${Date.now()}`,
          senderId: currentUser.id,
          receiverId,
          status: 'pending',
          timestamp: new Date().toISOString()
        };
        set({ friendRequests: [...friendRequests, newReq] });
      },

      acceptFriendRequest: (requestId) => {
        set((state) => ({
          friendRequests: state.friendRequests.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r)
        }));
      },

      rejectFriendRequest: (requestId) => {
        set((state) => ({
          friendRequests: state.friendRequests.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r)
        }));
      },

      removeFriend: (friendId) => {
        const { currentUser } = get();
        if (!currentUser) return;
        set((state) => ({
          friendRequests: state.friendRequests.filter(r => 
            !(r.status === 'accepted' && 
              ((r.senderId === currentUser.id && r.receiverId === friendId) || 
               (r.receiverId === currentUser.id && r.senderId === friendId)))
          )
        }));
      },

      // Chat actions
      setActiveChat: (chatId) => set({ activeChatId: chatId }),

      sendMessage: (chatId, content, type = 'normal') => {
        const { currentUser, messages, chats } = get();
        if (!currentUser) return;

        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          chatId,
          senderId: currentUser.id,
          type,
          content,
          encrypted: true,
          timestamp: new Date().toISOString(),
          viewed: false,
        };

        const chatMsgs = messages[chatId] || [];
        const updatedChats = chats.map((c) =>
          c.id === chatId ? { ...c, lastMessage: newMsg } : c
        );

        set({
          messages: { ...messages, [chatId]: [...chatMsgs, newMsg] },
          chats: updatedChats,
        });
      },

      setTyping: (chatId, isTyping) =>
        set((s) => ({ typingUsers: { ...s.typingUsers, [chatId]: isTyping } })),

      // UI actions
      setSection: (section) => set({ activeSection: section }),

      unlockVault: (pin) => {
        if (pin === '1234') {
          set({ vaultUnlocked: true });
          return true;
        }
        return false;
      },

      lockVault: () => set({ vaultUnlocked: false }),

      startCall: (partnerId, type) =>
        set({ callActive: true, callStatus: 'calling', callType: type, callPartnerId: partnerId }),

      shouldConnectCall: () =>
        set(state => state.callActive && state.callStatus === 'calling' ? { callStatus: 'connected' } : state),

      receiveCall: (partnerId, type) =>
        set({ callActive: true, callStatus: 'ringing', callType: type, callPartnerId: partnerId }),

      acceptCall: () =>
        set({ callStatus: 'connected' }),

      declineCall: () =>
        set({ callActive: false, callStatus: 'idle', callType: null, callPartnerId: null }),

      endCall: () =>
        set({ callActive: false, callStatus: 'idle', callType: null, callPartnerId: null }),
    }),
    {
      name: 'chatify-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        authStage: state.authStage,
        pendingEmail: state.pendingEmail,
        friendRequests: state.friendRequests,
      }),
    }
  )
);
