import assert from 'node:assert/strict';

const base = (process.argv[2] ?? 'http://localhost:4321').replace(/\/$/, '');
const canonicalBase = 'https://sunnychen.tw';
const routes = ['/', '/story/', '/deliberation/', '/privacy/', '/license/'];
const titles = new Set();
const checks = [];
for (const route of routes) {
  const response = await fetch(base + route);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.match(html, /<html[^>]+lang="zh-Hant-TW"/);
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  assert(title && !titles.has(title), `Missing or duplicate title: ${route}`); titles.add(title);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `One H1: ${route}`);
  assert.match(html, /<meta name="description" content="[^\"]{20,}"/);
  const canonical = html.match(/<link rel="canonical" href="([^\"]+)"/)?.[1];
  assert.equal(canonical, canonicalBase + route, `Canonical: ${route}`);
  assert(!/<meta name="robots" content="[^\"]*noindex/.test(html), `Public route noindex: ${route}`);
  const og = html.match(/<meta property="og:url" content="([^\"]+)"/)?.[1]; assert.equal(og, canonical);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  const image = html.match(/<meta property="og:image" content="([^\"]+)"/)?.[1]; assert(image);
  const imageResponse = await fetch(base + new URL(image).pathname); assert.equal(imageResponse.status, 200, `OG image: ${route}`);
  assert.match(imageResponse.headers.get('Content-Type') ?? '', /^image\//);
  const json = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  assert(json.length >= 2, `Structured page data: ${route}`);
  assert(!html.includes('Google 製卡尚未設定') || route === '/deliberation/');
  checks.push({ route, title, canonical, structuredData: json.length });
}
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
for (const route of routes) assert(sitemap.includes(`<loc>${canonicalBase}${route}</loc>`));
assert(!sitemap.includes('/api/'));
const robots = await (await fetch(base + '/robots.txt')).text();
assert(robots.includes('Disallow: /api/')); assert(robots.includes(`Sitemap: ${canonicalBase}/sitemap.xml`));
const missing = await fetch(base + '/seo-check-page-does-not-exist/'); assert.equal(missing.status, 404);
assert.match(await missing.text(), /<meta name="robots" content="[^"]*noindex/);
const api = await fetch(base + '/api/share-card/google/nonce/');
assert(api.headers.get('Cache-Control')?.includes('no-store')); assert(api.headers.get('X-Robots-Tag')?.includes('noindex'));
console.log(JSON.stringify({ base, publicPages: checks, sitemap: 'passed', robots: 'passed', privateAPI: 'no-store / noindex', missingPage: '404 / noindex' }, null, 2));
