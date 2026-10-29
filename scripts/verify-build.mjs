import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { basePath, siteDirectory } from '../deployment.config.mjs';
const root = path.resolve(siteDirectory);
const locales = ['ko','en','ja','zh-Hant','zh-Hans'];
const pagePaths = ['', 'faq/', 'privacy/', 'terms/'];
export const routes = locales.flatMap(locale => pagePaths.map(page => `/${locale}/${page}`));
const aliases = ['/', '/faq/', '/privacy/', '/terms/'];
export const decode = value => value.replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1),16) : Number(n))).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
export const plain = value => decode(value.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const files = async dir => (await Promise.all((await readdir(dir, { withFileTypes: true })).map(e => e.isDirectory() ? files(path.join(dir, e.name)) : path.join(dir,e.name)))).flat();
const all = await files(root);
assert(all.length < 20000, 'Pages file count');
for (const file of all) {
  assert((await stat(file)).size < 25 * 1024 * 1024, `${file}: exceeds Pages file limit`);
  if (/\.(css|html|js)$/.test(file)) {
    const text = await readFile(file,'utf8');
    assert(!/<iframe\b/i.test(text), `${file}: embedded iframe`);
    assert(!/(?:src|poster)=["']https?:\/\//i.test(text), `${file}: external media/script source`);
    assert(!/url\(\s*["']?https?:\/\//i.test(text), `${file}: remote CSS asset`);
    assert(!/upload\.cafenono\.com|vz-127031db-d43\.b-cdn\.net/.test(text), `${file}: original media CDN dependency`);
  }
}
let origin;
const titles = new Set();
const descriptions = new Set();
for (const route of [...routes, ...aliases]) {
  const html = await readFile(path.join(root, route, 'index.html'),'utf8');
  assert.equal((html.match(/<h1\b/g) || []).length,1, `${route}: one H1`);
  const locale = aliases.includes(route) ? 'ko' : route.split('/')[1];
  assert(html.includes(`<html lang="${locale}"`), `${route}: correct HTML language`);
  assert(/<meta name="viewport"/.test(html), `${route}: viewport`);
  assert(/<meta name="description" content="[^"]+"/.test(html), `${route}: description`);
  assert(/<title>[^<]+<\/title>/.test(html), `${route}: title`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
  const url = new URL(canonical);
  origin ||= url.origin;
  assert.equal(url.origin, origin, 'consistent canonical origin');
  const canonicalPath = aliases.includes(route) ? `/ko${route}` : route;
  assert.equal(url.pathname,`${basePath}${canonicalPath}`);
  if (!aliases.includes(route)) {
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
    assert(!titles.has(title), `${route}: unique title`);
    assert(!descriptions.has(description), `${route}: unique description`);
    titles.add(title); descriptions.add(description);
  }
  for (const language of [...locales, 'x-default']) {
    const alternate = html.match(new RegExp(`<link rel="alternate" hreflang="${language}" href="([^"]+)"`));
    assert(alternate, `${route}: ${language} hreflang`);
    const expected = language === 'x-default' ? '/' + canonicalPath.split('/').slice(2).join('/') : '/' + language + '/' + canonicalPath.split('/').slice(2).join('/');
    assert.equal(new URL(alternate[1]).pathname, `${basePath}${expected}`);
    assert.equal(new URL(alternate[1]).origin, origin);
  }
  assert(html.includes(`property="og:url" content="${canonical}"`));
  assert(!/name="robots" content="noindex/.test(html), `${route}: not accidentally noindex`);
  const references = [...html.matchAll(/\b(?:href|src|poster|data-src)="([^"]+)"/g)].map(match => decode(match[1]));
  references.push(...[...html.matchAll(/\bsrcset="([^"]+)"/g)].flatMap(match => decode(match[1]).split(',').map(candidate => candidate.trim().split(/\s+/)[0])));
  for (const value of references) {
    if (/^(?:https?:|mailto:|data:)/.test(value)) continue;
    const target = new URL(value, `http://local${basePath}${route}`);
    assert(target.pathname.startsWith(`${basePath}/`), `${route}: reference outside site prefix: ${value}`);
    let local = path.join(root,decodeURIComponent(target.pathname.slice(basePath.length)));
    if (target.pathname.endsWith('/')) local = path.join(local,'index.html');
    await stat(local).catch(() => assert.fail(`${route}: missing local link/asset ${value}`));
    if (target.hash && /\.html$/.test(local)) {
      const document = await readFile(local,'utf8');
      assert(document.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${route}: missing anchor ${value}`);
    }
  }
}
const sitemap = await readFile(path.join(root,'sitemap.xml'),'utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,20);
for(const route of routes) assert(sitemap.includes(`<loc>${origin}${basePath}${route}</loc>`));
assert(!sitemap.includes('/404'));
for (const locale of locales) assert((await readFile(path.join(root,locale,'404/index.html'),'utf8')).includes('noindex'));
assert((await readFile(path.join(root,'robots.txt'),'utf8')).includes(`${origin}${basePath}/sitemap.xml`));
assert((await readFile(path.join(root,'404.html'),'utf8')).includes('noindex'));
assert(!/(?:example\.com|your-domain|TODO|TBD)/.test(sitemap));
const deployment = JSON.parse(await readFile('wrangler.jsonc', 'utf8'));
assert.equal(deployment.assets.base_path, undefined, 'mount via file paths without account-gated features');
assert.equal(deployment.assets.directory, './dist');
assert.equal(deployment.assets.not_found_handling, '404-page');
assert.deepEqual(deployment.routes, [{ pattern: 'diaro.app', custom_domain: true }]);
assert((await readFile('dist/_redirects', 'utf8')).includes(`${basePath} ${basePath}/ 301`));
assert((await readFile('dist/_headers', 'utf8')).includes(`${basePath}/_astro/*`));
console.log(`Verified ${routes.length} pages, localized metadata, reciprocal hreflang, local links/anchors, media, sitemap, robots, 404 and ${all.length} files. Origin: ${origin}`);
