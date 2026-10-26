import upstream, { type SensemakingQueueMessage } from './index';
export { Conversation } from './conversation';
export { NeuronCoordinator } from './neuron-coordinator';

const json = (message: string, status: number) => Response.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });

async function validSetupToken(request: Request, expected?: string): Promise<boolean> {
  if (!expected || !request.headers.get('Authorization')?.startsWith('Bearer ')) return false;
  const actual = request.headers.get('Authorization')!.slice(7);
  const encode = (s: string) => new TextEncoder().encode(s);
  const [a, b] = await Promise.all([crypto.subtle.digest('SHA-256', encode(actual)), crypto.subtle.digest('SHA-256', encode(expected))]);
  const left = new Uint8Array(a); const right = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i]! ^ right[i]!;
  return difference === 0;
}

async function limitedBody(request: Request): Promise<string | null> {
  if (!request.body) return '';
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16_384) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const body = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(body);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const allowed = new Set((env.SUNNY_ALLOWED_ORIGINS ?? 'https://sunnychen.tw').split(',').map(s => s.trim()).filter(Boolean));
    allowed.add(url.origin);
    const finish = (response: Response) => {
      const headers = new Headers(response.headers);
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      if (origin && allowed.has(origin)) {
        headers.set('Access-Control-Allow-Origin', origin);
        headers.set('Vary', [headers.get('Vary'), 'Origin'].filter(Boolean).join(', '));
      }
      return new Response(response.body, { status: response.status, headers });
    };
    if (url.pathname === '/mcp') return finish(json('not found', 404));
    if (url.pathname === '/') return Response.redirect(`${env.SUNNY_SITE_URL ?? 'https://sunnychen.tw'}/deliberation/`, 302);
    if (url.pathname.startsWith('/api/') && origin && !allowed.has(origin)) return finish(json('origin not allowed', 403));
    if (request.method === 'OPTIONS') {
      if (!origin || !allowed.has(origin) || !url.pathname.startsWith('/api/')) return finish(json('origin not allowed', 403));
      return finish(new Response(null, { status: 204, headers: { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' } }));
    }
    const creating = url.pathname === '/api/conversations' && request.method === 'POST';
    if (creating && !(await validSetupToken(request, env.SUNNY_SETUP_TOKEN))) return finish(json('conversation creation is restricted to the site operator', 401));
    if (request.method === 'POST' && url.pathname.startsWith('/api/')) {
      if (!request.headers.get('Content-Type')?.includes('application/json')) return finish(json('application/json required', 415));
      const body = await limitedBody(request);
      if (body === null) return finish(json('request body too large', 413));
      let input: Record<string, unknown>;
      try { input = JSON.parse(body); } catch { return finish(json('invalid JSON', 400)); }
      if (!input || typeof input !== 'object' || Array.isArray(input)) return finish(json('invalid body', 400));
      if (creating) Object.assign(input, { autoApprove: false, allowSubmissions: true, openData: false });
      if (/\/admin\/settings$/.test(url.pathname) && (input.autoApprove === true || input.openData === true)) {
        return finish(json('this deployment requires statement moderation and private row-level exports', 403));
      }
      request = new Request(request, { body: JSON.stringify(input) });
    }
    return finish(await upstream.fetch(request, env, ctx));
  },
  async queue(batch: MessageBatch<SensemakingQueueMessage>, env: Env, ctx: ExecutionContext) {
    return upstream.queue(batch, env, ctx);
  },
} satisfies ExportedHandler<Env, SensemakingQueueMessage>;
