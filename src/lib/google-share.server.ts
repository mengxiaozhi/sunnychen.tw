import { OAuth2Client } from 'google-auth-library';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { deliberationConfig } from '../data/deliberation';

const verifier = new OAuth2Client();
export const shareClientId = deliberationConfig.googleClientId;
export const shareClientConfigured = /^[A-Za-z0-9-]+\.apps\.googleusercontent\.com$/.test(shareClientId);
export const nonceName = (url: string) => new URL(url).protocol === 'https:' ? '__Host-sunny-share-nonce' : 'sunny-share-nonce';
export const newNonce = () => randomBytes(32).toString('hex');

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  const own = new URL(request.url).origin;
  return origin === own && (own === 'https://sunnychen.tw' || /^http:\/\/localhost:\d+$/.test(own));
}

export async function verifyShareProfile(credential: string, nonce: string): Promise<{ name: string; avatar: string | null }> {
  const ticket = await verifier.verifyIdToken({ idToken: credential, audience: shareClientId });
  const payload = ticket.getPayload() as (ReturnType<typeof ticket.getPayload> & { nonce?: string });
  if (!payload || !/^[a-f0-9]{64}$/.test(nonce) || typeof payload.nonce !== 'string' || !/^[a-f0-9]{64}$/.test(payload.nonce)) throw new Error('invalid login nonce');
  if (!timingSafeEqual(Buffer.from(payload.nonce), Buffer.from(nonce))) throw new Error('invalid login nonce');
  if (typeof payload.name !== 'string' || !payload.name.trim()) throw new Error('missing display name');
  const name = Array.from(payload.name.trim()).slice(0, 80).join('');
  let avatar: string | null = null;
  if (typeof payload.picture === 'string') {
    try {
      const url = new URL(payload.picture);
      if (url.protocol !== 'https:' || !/^lh\d+\.googleusercontent\.com$/.test(url.hostname) || url.port || url.username || url.password) throw new Error('unsupported avatar URL');
      const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(7000), cache: 'no-store' });
      const mime = (response.headers.get('Content-Type') ?? '').split(';')[0].trim().toLowerCase();
      if (!response.ok || !['image/jpeg', 'image/png', 'image/webp'].includes(mime) || !response.body) throw new Error('unsupported image');
      const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.byteLength;
        if (size > 256 * 1024) { await reader.cancel(); throw new Error('avatar too large'); }
        chunks.push(value);
      }
      avatar = `data:${mime};base64,${Buffer.concat(chunks).toString('base64')}`;
    } catch {
      // An unavailable Google image does not block a verified name or expose an arbitrary URL.
    }
  }
  // No email, Google subject, token, or opinion identifier is retained or returned.
  return { name, avatar };
}
