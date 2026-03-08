// Encryption utilities using Web Crypto API (AES-256-GCM + RSA-OAEP)
// This runs entirely client-side - no server ever sees plaintext

/**
 * Generate an RSA key pair for end-to-end encryption
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a symmetric AES-256-GCM key
 */
export async function generateAESKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a string message using AES-256-GCM
 * Returns base64-encoded ciphertext with IV prepended
 */
export async function encryptMessage(plaintext: string, key?: CryptoKey): Promise<string> {
  const aesKey = key || await generateAESKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encoded
  );

  // Combine IV + ciphertext
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a base64-encoded AES-256-GCM ciphertext
 */
export async function decryptMessage(cipherBase64: string, key: CryptoKey): Promise<string> {
  const combined = new Uint8Array(
    atob(cipherBase64).split('').map((c) => c.charCodeAt(0))
  );

  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Encrypt a File (image/video/audio) client-side before upload
 * Returns encrypted ArrayBuffer
 */
export async function encryptFile(file: File): Promise<{ encryptedData: ArrayBuffer; keyBase64: string }> {
  const aesKey = await generateAESKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const buffer = await file.arrayBuffer();

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    buffer
  );

  // Export key for storage (in real app, this would be RSA-wrapped)
  const exportedKey = await window.crypto.subtle.exportKey('raw', aesKey);
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));

  return { encryptedData: ciphertext, keyBase64 };
}

/**
 * Encrypt GPS coordinates
 */
export async function encryptLocation(lat: number, lng: number): Promise<string> {
  const locationStr = JSON.stringify({ lat, lng, timestamp: Date.now() });
  return await encryptMessage(locationStr);
}

/**
 * Generate a deterministic avatar emoji from username
 */
export function getUserAvatar(username: string): string {
  const avatars = ['😎', '🌸', '🔥', '✨', '🚀', '🎯', '💫', '🦋', '🌊', '⚡', '🎸', '🌺', '🦊', '🐬', '🎨'];
  const index = username.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatars.length;
  return avatars[index];
}

/**
 * Format relative time
 */
export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Format time for message timestamps
 */
export function formatMessageTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Generate a 6-digit OTP (client-side demo simulation)
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
