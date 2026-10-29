import { mkdir, readdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { siteDirectory } from '../deployment.config.mjs';

// Astro cleans dist/ before building. Match the public /shardee path on disk
// without relying on the account-gated assets.base_path feature.
const entries = await readdir('dist');
await mkdir(siteDirectory);
for (const entry of entries) {
  if (['_headers', '_redirects'].includes(entry)) continue;
  await rename(path.join('dist', entry), path.join(siteDirectory, entry));
}
