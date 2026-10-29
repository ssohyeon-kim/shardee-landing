import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { loadEnv } from 'vite';
const env = { ...loadEnv(process.env.NODE_ENV || 'production', process.cwd(), ''), ...process.env };
const configured = env.SITE_URL?.trim();
if (env.CF_PAGES && !configured) throw new Error('Cloudflare builds require the actual HTTPS SITE_URL.');
const origin = new URL(configured || 'http://localhost:4321');
if (configured && (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password)) {
  throw new Error('SITE_URL must be an HTTPS origin without a path, query, or credentials.');
}
export default defineConfig({
  output: 'static',
  markdown: { processor: satteri({ features: { smartPunctuation: false } }) },
  site: origin.origin,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
