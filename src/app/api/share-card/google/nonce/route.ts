import { NextRequest, NextResponse } from 'next/server';
import { newNonce, nonceName, shareClientConfigured, shareClientId } from '../../../../../lib/google-share.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex, nofollow' };
  if (!shareClientConfigured) return NextResponse.json({ error: 'Google 登入尚未完成設定。' }, { status: 503, headers });
  const fetchSite = request.headers.get('Sec-Fetch-Site');
  if (fetchSite && !['same-origin', 'none'].includes(fetchSite)) return NextResponse.json({ error: '請從本站開始登入。' }, { status: 403, headers });
  const nonce = newNonce();
  const response = NextResponse.json({ nonce, clientId: shareClientId }, { headers });
  response.cookies.set(nonceName(request.url), nonce, { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'strict', maxAge: 600, path: '/' });
  return response;
}
