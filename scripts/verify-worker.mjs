import assert from 'node:assert/strict';
import { basePath } from '../deployment.config.mjs';

const origin = 'http://127.0.0.1:8787';
const routes = ['/', '/faq/', '/privacy/', '/terms/', ...['ko', 'en', 'ja', 'zh-Hant', 'zh-Hans'].flatMap(locale => ['', 'faq/', 'privacy/', 'terms/'].map(page => `/${locale}/${page}`))];
for (const route of routes) {
  const response = await fetch(`${origin}${basePath}${route}`);
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert(html.includes('<html lang='), route);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
}
const redirect = await fetch(`${origin}${basePath}?ref=check`, { redirect: 'manual' });
assert.equal(redirect.status, 301);
const destination = new URL(redirect.headers.get('location'), origin);
assert.equal(destination.pathname, `${basePath}/`);
assert.equal(destination.search, '?ref=check');
await redirect.body?.cancel();

for (const query of ['', '?ref=check&lang=en']) {
  const response = await fetch(`${origin}/${query}`, { redirect: 'manual' });
  assert.equal(response.status, 302, 'root redirects to the Korean home');
  const destination = new URL(response.headers.get('location'), origin);
  assert.equal(destination.origin, origin);
  assert.equal(destination.pathname, `${basePath}/ko/`);
  assert.equal(destination.search, query, 'root redirect preserves query parameters');
  await response.body?.cancel();
}

for (const route of ['/brand/favicon.png', '/brand/og.png', '/brand/app-store.svg', '/brand/google-play.png', '/sitemap.xml', '/robots.txt']) {
  const response = await fetch(`${origin}${basePath}${route}`);
  assert.equal(response.status, 200, route);
  await response.body?.cancel();
}
const video = await fetch(`${origin}${basePath}/media/hero.mp4`, { headers: { Range: 'bytes=0-99' } });
assert([200, 206].includes(video.status), 'video is served');
assert.equal(video.headers.get('content-type'), 'video/mp4');
const bytes = Buffer.from(await video.arrayBuffer());
assert.equal(bytes.subarray(4, 8).toString(), 'ftyp');
if (video.status === 206) assert.equal(bytes.byteLength, 100);

const home = await (await fetch(`${origin}${basePath}/ko/`)).text();
const stylesheet = home.match(/href="([^"]+\.css)"/)[1];
const css = await fetch(new URL(stylesheet, origin));
assert.equal(css.status, 200);
assert.equal(css.headers.get('cache-control'), 'public, max-age=31536000, immutable');
await css.body?.cancel();

const missing = await fetch(`${origin}${basePath}/missing/`);
assert.equal(missing.status, 404);
assert((await missing.text()).includes('noindex'), 'custom 404 page');
for (const route of ['/ko/', '/shardee-other/']) {
  const response = await fetch(`${origin}${route}`);
  assert.equal(response.status, 404, `${route}: outside the mount`);
  assert(!(await response.text()).includes('site-locale-route'), `${route}: must not serve Shardee outside the mount`);
}
console.log(`Verified Workers: ${routes.length} pages, root/prefix redirects and query, public assets/video, cache/security headers, custom 404 and mount boundary.`);
