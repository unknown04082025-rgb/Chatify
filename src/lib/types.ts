// Types
export type UserType = 'normal' | 'atithi' | 'admin';
export type UserStatus = 'available' | 'not-available';
export type MessageType = 'normal' | 'after-view' | 'timed-delete' | 'snap' | 'voice' | 'location' | 'image';
export type AuthStage = 'signup' | 'otp-verify' | 'logged-in';

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  type: UserType;
  status: UserStatus;
  joinedDate: string;
  loginCount: number; // used to determine auth stage
  emailVerified: boolean;
  lastSeen: string;
  device?: string;
  bio?: string;
  friendsCount?: number;
  sentRequestsCount?: number;
  receivedRequestsCount?: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string;
  encrypted: boolean;
  timestamp: string;
  viewed: boolean;
  viewCount?: number;
  deleteAfterView?: boolean;
  deleteAt?: string;
  saved?: boolean;
}

export interface Chat {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  viewers: string[];
  expiresAt: string;
  createdAt: string;
}

export interface VaultItem {
  id: string;
  ownerId: string;
  sharedWithId: string;
  type: 'image' | 'video' | 'voice';
  name: string;
  encrypted: boolean;
  size: string;
  thumbnail?: string;
  createdAt: string;
}

export interface Memory {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  note: string;
  attachedVaultItems: string[];
  reminderType: '1month' | '6months' | '1year' | null;
  createdAt: string;
}

export interface AtithiRequest {
  id: string;
  userId: string;
  username: string;
  email: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface LoginActivity {
  id: string;
  userId: string;
  username: string;
  action: 'login' | 'logout' | 'otp-sent' | 'otp-verified';
  timestamp: string;
  device: string;
  ip: string;
}
