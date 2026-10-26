import { beforeEach, describe, expect, it, vi } from 'vitest';
const upstream = vi.hoisted(() => ({
  fetch: vi.fn(async (_request: Request, _env: Env, _ctx: ExecutionContext) => Response.json({ ok: true })),
  queue: vi.fn(async () => undefined),
}));
vi.mock('../src/index', () => ({ default: upstream }));
vi.mock('../src/conversation', () => ({ Conversation: class {} }));
vi.mock('../src/neuron-coordinator', () => ({ NeuronCoordinator: class {} }));
import worker from '../src/sunny-worker';

const env = {
  SUNNY_ALLOWED_ORIGINS: 'https://sunnychen.tw',
  SUNNY_SITE_URL: 'https://sunnychen.tw',
  SUNNY_SETUP_TOKEN: 'test-only-operator-token',
} as Env;
const ctx = {} as ExecutionContext;
const base = 'https://sunnychen-polis.example.workers.dev';
const post = (path: string, body: unknown, token?: string) => new Request(base + path, {
  method: 'POST', headers: { Origin: 'https://sunnychen.tw', 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body),
});
beforeEach(() => { vi.clearAllMocks(); });

describe('Sunny REST deployment boundary', () => {
  it('denies public creation before touching storage', async () => {
    const response = await worker.fetch(post('/api/conversations', { title: 'test' }), env, ctx);
    expect(response.status).toBe(401); expect(upstream.fetch).not.toHaveBeenCalled();
  });
  it('requires the correct setup credential and forces moderated private data', async () => {
    const response = await worker.fetch(post('/api/conversations', { title: 'test', autoApprove: true, openData: true, allowSubmissions: false }, env.SUNNY_SETUP_TOKEN), env, ctx);
    expect(response.status).toBe(200);
    const request = upstream.fetch.mock.calls[0]![0] as Request;
    expect(await request.json()).toMatchObject({ autoApprove: false, openData: false, allowSubmissions: true });
  });
  it('rejects a different credential', async () => {
    expect((await worker.fetch(post('/api/conversations', {}, 'wrong'), env, ctx)).status).toBe(401);
    expect(upstream.fetch).not.toHaveBeenCalled();
  });
  it('denies unregistered browser origins', async () => {
    const response = await worker.fetch(new Request(base + '/api/health', { headers: { Origin: 'https://unrelated.example' } }), env, ctx);
    expect(response.status).toBe(403); expect(response.headers.has('Access-Control-Allow-Origin')).toBe(false); expect(upstream.fetch).not.toHaveBeenCalled();
  });
  it('allows only participant preflight headers for the canonical site', async () => {
    const response = await worker.fetch(new Request(base + '/api/conversations/abcdefghij/votes', { method: 'OPTIONS', headers: { Origin: 'https://sunnychen.tw' } }), env, ctx);
    expect(response.status).toBe(204); expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://sunnychen.tw'); expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
  });
  it('prevents relaxing moderation and row-level exports', async () => {
    for (const settings of [{ autoApprove: true }, { openData: true }]) {
      expect((await worker.fetch(post('/api/conversations/abcdefghij/admin/settings', settings), env, ctx)).status).toBe(403);
    }
    expect(upstream.fetch).not.toHaveBeenCalled();
  });
  it('rejects oversized requests before upstream work', async () => {
    const response = await worker.fetch(post('/api/conversations/abcdefghij/statements', { text: 'x'.repeat(17000) }), env, ctx);
    expect(response.status).toBe(413); expect(upstream.fetch).not.toHaveBeenCalled();
  });
  it('does not expose MCP and marks responses as not indexable', async () => {
    const response = await worker.fetch(new Request(base + '/mcp'), env, ctx);
    expect(response.status).toBe(404); expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });
  it('keeps public aggregate requests on the original service', async () => {
    const response = await worker.fetch(new Request(base + '/api/conversations/abcdefghij/results', { headers: { Origin: 'https://sunnychen.tw' } }), env, ctx);
    expect(response.status).toBe(200); expect(upstream.fetch).toHaveBeenCalledTimes(1); expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://sunnychen.tw');
  });
});
