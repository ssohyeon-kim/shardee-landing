import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { decode } from '../../scripts/verify-build.mjs';

test('FAQ and legal pages retain all source blocks, nested answers, clauses and links', async () => {
  const { verifyContent } = await import('../../docs/reference/verify-content.mjs');
  const result = await verifyContent();
  assert.equal(result.faq.questions, 18);
  assert.equal(result.privacy.clauses, 13);
  assert.equal(result.terms.clauses, 16);
});

test('home has both stores and no excluded social interface', async () => {
  const html = await readFile('dist/shardee/index.html','utf8');
  assert(html.includes('https://apps.apple.com/kr/app/id6739505769'));
  assert(decode(html).includes('https://play.google.com/store/apps/details?id=com.shardee.aos'));
  assert(!/응원 한마디|댓글|후원하기|buymeacoffee|<form\b/i.test(html));
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const application = data['@graph'].find(node => node['@type'] === 'SoftwareApplication');
  assert(application);
  assert(!('aggregateRating' in application));
});
