import { loadEnv } from 'vite';
const value = process.env.SITE_URL || loadEnv('production', process.cwd(), '').SITE_URL;
if (!value || new URL(value).protocol !== 'https:') throw new Error('Set SITE_URL to the real public HTTPS origin before production builds.');
