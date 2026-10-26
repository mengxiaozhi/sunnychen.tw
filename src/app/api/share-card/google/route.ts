import { NextRequest, NextResponse } from 'next/server';
import { nonceName, sameOrigin, shareClientConfigured, verifyShareProfile } from '../../../../lib/google-share.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 15;
const headers = { 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex, nofollow' };

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: '請從本站開始登入。' }, { status: 403, headers });
  if (!shareClientConfigured) return NextResponse.json({ error: 'Google 登入尚未完成設定。' }, { status: 503, headers });
  const reply = (body: unknown, status: number) => {
    const response = NextResponse.json(body, { status, headers });
    response.cookies.set(nonceName(request.url), '', { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'strict', maxAge: 0, path: '/' });
    return response;
  };
  const nonce = request.cookies.get(nonceName(request.url))?.value ?? '';
  if (!/^[a-f0-9]{64}$/.test(nonce)) return reply({ error: '登入狀態已過期，請重新開始。' }, 403);
  if (!request.headers.get('Content-Type')?.includes('application/json')) return reply({ error: '請重新開始 Google 登入。' }, 415);
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: '登入驗證資料不完整。' }, 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 16_384) { await reader.cancel(); return reply({ error: '登入驗證資料過大。' }, 413); } chunks.push(value); }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (typeof body.credential !== 'string' || body.credential.length > 16_000 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(body.credential)) return reply({ error: '登入驗證資料不完整。' }, 400);
    const profile = await verifyShareProfile(body.credential, nonce);
    return reply({ profile }, 200);
  } catch {
    return reply({ error: 'Google 登入驗證未完成，請重新登入。' }, 401);
  }
}
