import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

test('all recorded assets match downloaded bytes, signatures and checksums', async () => {
  const { assets } = JSON.parse(await readFile('docs/assets/asset-sources.json', 'utf8'));
  assert(assets.length >= 10);
  for (const asset of assets) {
    const bytes = await readFile(asset.localPath);
    assert.equal(bytes.length,asset.bytes,asset.id);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256,asset.id);
    assert(bytes.length < 25 * 1024 * 1024);
    const header = bytes.subarray(0,2000).toString();
    assert(!/<html|<!doctype html/i.test(header),`${asset.id}: error document`);
    if (asset.mime === 'video/mp4') assert.equal(bytes.subarray(4,8).toString(),'ftyp');
    if (asset.mime === 'image/png') assert.equal(bytes.subarray(1,4).toString(),'PNG');
    if (asset.mime === 'image/jpeg') assert.equal(bytes.subarray(0,3).toString('hex'),'ffd8ff');
    if (asset.mime === 'image/webp') assert.equal(bytes.subarray(8,12).toString(),'WEBP');
    if (asset.mime === 'image/svg+xml') assert(header.includes('<svg'));
  }
});
