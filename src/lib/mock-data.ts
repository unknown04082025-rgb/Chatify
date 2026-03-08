import type { User, Message, Chat, Story, VaultItem, Memory, AtithiRequest, LoginActivity, FriendRequest } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    username: 'arjun_dev',
    email: 'arjun@chatify.io',
    displayName: 'Arjun Mehta',
    avatar: '😎',
    type: 'normal',
    status: 'available',
    joinedDate: '2024-01-15',
    loginCount: 0,
    emailVerified: false,
    lastSeen: 'now',
    device: 'Chrome on Ubuntu',
    bio: 'Building the future, one line at a time.',
  },
  {
    id: 'user-2',
    username: 'priya_sparks',
    email: 'priya@chatify.io',
    displayName: 'Priya Sharma',
    avatar: '🌸',
    type: 'normal',
    status: 'available',
    joinedDate: '2024-02-20',
    loginCount: 5,
    emailVerified: true,
    lastSeen: 'now',
    device: 'Safari on iPhone',
    bio: 'Design enthusiast & coffee lover ☕',
  },
  {
    id: 'user-3',
    username: 'rahul_x',
    email: 'rahul@chatify.io',
    displayName: 'Rahul Verma',
    avatar: '🔥',
    type: 'normal',
    status: 'not-available',
    joinedDate: '2024-03-05',
    loginCount: 12,
    emailVerified: true,
    lastSeen: '2 hours ago',
    device: 'Firefox on Windows',
    bio: 'Night owl, day dreamer.',
  },
  {
    id: 'user-4',
    username: 'neha_atithi',
    email: 'neha@exclusive.io',
    displayName: 'Neha Kapoor',
    avatar: '✨',
    type: 'atithi',
    status: 'available',
    joinedDate: '2024-04-01',
    loginCount: 3,
    emailVerified: true,
    lastSeen: 'now',
    device: 'Chrome on macOS',
    bio: 'Exclusive member.',
  }
];

export const MOCK_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'req-f-1',
    senderId: 'user-2',
    receiverId: 'user-1',
    status: 'accepted',
    timestamp: '2024-02-21T10:00:00Z'
  },
  {
    id: 'req-f-2',
    senderId: 'user-3',
    receiverId: 'user-1',
    status: 'pending',
    timestamp: new Date().toISOString()
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    chatId: 'chat-1',
    senderId: 'user-2',
    type: 'normal',
    content: 'Hey! How are you doing? 😊',
    encrypted: true,
    timestamp: new Date(Date.now() - 120000).toISOString(),
    viewed: true,
  },
  {
    id: 'msg-2',
    chatId: 'chat-1',
    senderId: 'user-1',
    type: 'normal',
    content: 'I\'m great! Just working on the new Chatify features 🚀',
    encrypted: true,
    timestamp: new Date(Date.now() - 90000).toISOString(),
    viewed: true,
  },
  {
    id: 'msg-3',
    chatId: 'chat-1',
    senderId: 'user-2',
    type: 'normal',
    content: 'That sounds amazing! Can\'t wait to try it out 🎉',
    encrypted: true,
    timestamp: new Date(Date.now() - 60000).toISOString(),
    viewed: false,
  },
  {
    id: 'msg-4',
    chatId: 'chat-1',
    senderId: 'user-2',
    type: 'after-view',
    content: 'This message disappears after you view it! 👀',
    encrypted: true,
    timestamp: new Date(Date.now() - 30000).toISOString(),
    viewed: false,
    deleteAfterView: true,
  },
  {
    id: 'msg-5',
    chatId: 'chat-1',
    senderId: 'user-1',
    type: 'voice',
    content: '0:15',
    encrypted: true,
    timestamp: new Date(Date.now() - 10000).toISOString(),
    viewed: false,
  },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat-1',
    participantIds: ['user-1', 'user-2'],
    lastMessage: MOCK_MESSAGES[MOCK_MESSAGES.length - 1],
    unreadCount: 2,
    isTyping: false,
  },
  {
    id: 'chat-2',
    participantIds: ['user-1', 'user-3'],
    lastMessage: {
      id: 'msg-r1',
      chatId: 'chat-2',
      senderId: 'user-3',
      type: 'normal',
      content: 'Ready for the match tonight? ⚽',
      encrypted: true,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      viewed: true,
    },
    unreadCount: 0,
    isTyping: false,
  },
];

export const MOCK_STORIES: Story[] = [
  {
    id: 'story-1',
    userId: 'user-2',
    mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    mediaType: 'image',
    caption: 'Beautiful day at the mountains! 🏔️',
    viewers: ['user-1', 'user-3'],
    expiresAt: new Date(Date.now() + 3600000 * 20).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'story-2',
    userId: 'user-3',
    mediaUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400',
    mediaType: 'image',
    caption: 'Working late nights 🌙',
    viewers: ['user-1'],
    expiresAt: new Date(Date.now() + 3600000 * 18).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

export const MOCK_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'vault-1',
    ownerId: 'user-1',
    sharedWithId: 'user-2',
    type: 'image',
    name: 'vacation_beach.jpg',
    encrypted: true,
    size: '2.4 MB',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'vault-2',
    ownerId: 'user-2',
    sharedWithId: 'user-1',
    type: 'image',
    name: 'birthday_party.jpg',
    encrypted: true,
    size: '1.8 MB',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'vault-3',
    ownerId: 'user-1',
    sharedWithId: 'user-2',
    type: 'voice',
    name: 'voice_memo_2024.m4a',
    encrypted: true,
    size: '0.5 MB',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export const MOCK_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    userId: 'user-1',
    date: '2026-02-14',
    note: 'Valentine\'s day dinner with friends 🌹',
    attachedVaultItems: ['vault-2'],
    reminderType: '1year',
    createdAt: '2026-02-14T18:00:00Z',
  },
  {
    id: 'mem-2',
    userId: 'user-1',
    date: '2026-01-01',
    note: 'New Year 2026! Amazing fireworks 🎆',
    attachedVaultItems: [],
    reminderType: '1year',
    createdAt: '2026-01-01T00:30:00Z',
  },
];

export const MOCK_ATITHI_REQUESTS: AtithiRequest[] = [
  {
    id: 'req-1',
    userId: 'req-user-1',
    username: 'sanjay_k',
    email: 'sanjay@example.com',
    reason: 'I was referred by Neha Kapoor and would like to join the exclusive community.',
    status: 'pending',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'req-2',
    userId: 'req-user-2',
    username: 'meera_n',
    email: 'meera@example.com',
    reason: 'I am an artist and heard about this platform through exclusive channels.',
    status: 'pending',
    submittedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

export const MOCK_LOGIN_ACTIVITY: LoginActivity[] = [
  {
    id: 'log-1',
    userId: 'user-2',
    username: 'priya_sparks',
    action: 'login',
    timestamp: new Date(Date.now() - 60000 * 5).toISOString(),
    device: 'Safari on iPhone',
    ip: '192.168.1.***',
  },
  {
    id: 'log-2',
    userId: 'user-1',
    username: 'arjun_dev',
    action: 'otp-sent',
    timestamp: new Date(Date.now() - 60000 * 10).toISOString(),
    device: 'Chrome on Ubuntu',
    ip: '10.0.0.***',
  },
  {
    id: 'log-3',
    userId: 'user-1',
    username: 'arjun_dev',
    action: 'otp-verified',
    timestamp: new Date(Date.now() - 60000 * 9).toISOString(),
    device: 'Chrome on Ubuntu',
    ip: '10.0.0.***',
  },
  {
    id: 'log-4',
    userId: 'user-3',
    username: 'rahul_x',
    action: 'logout',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    device: 'Firefox on Windows',
    ip: '172.16.0.***',
  },
];
