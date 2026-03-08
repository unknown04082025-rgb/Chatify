'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Message, Chat } from './types';
import { MOCK_USERS, MOCK_MESSAGES, MOCK_CHATS } from './mock-data';

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
  callType: 'voice' | 'video' | null;
  callPartnerId: string | null;
}

interface AppStore extends AuthState, ChatState, UIState {
  // Auth actions
  signUp: (user: Partial<User>, password: string) => void;
  login: (email: string, password: string) => 'needs-otp' | 'authenticated' | 'error';
  verifyOTP: (otp: string) => boolean;
  logout: () => void;
  setPendingEmail: (email: string) => void;

  // Chat actions
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (chatId: string, content: string, type?: Message['type']) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;

  // UI actions
  setSection: (section: UIState['activeSection']) => void;
  unlockVault: (pin: string) => boolean;
  lockVault: () => void;
  startCall: (partnerId: string, type: 'voice' | 'video') => void;
  endCall: () => void;
}

// Demo registered users: simulate already-registered users
const REGISTERED_USERS: Record<string, { user: User; password: string }> = {
  'priya@chatify.io': { user: MOCK_USERS[1], password: 'demo123' },
  'rahul@chatify.io': { user: MOCK_USERS[2], password: 'demo123' },
  'admin@chatify.io': { user: MOCK_USERS[4], password: 'admin123' },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Auth initial state
      currentUser: null,
      isAuthenticated: false,
      pendingEmail: '',
      authStage: 'idle',

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
        set({ callActive: true, callType: type, callPartnerId: partnerId }),

      endCall: () =>
        set({ callActive: false, callType: null, callPartnerId: null }),
    }),
    {
      name: 'chatify-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        authStage: state.authStage,
        pendingEmail: state.pendingEmail,
      }),
    }
  )
);
