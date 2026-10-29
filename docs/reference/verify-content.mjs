import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const decode = (value) => value.replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n))).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const normalize = (value) => value.replace(/\s+/gu, '');
const visible = (html) => normalize(decode(html.replace(/<[^>]*>/g, '')));
const sourceText = (block) => (block.value.tokens || []).map((token) => token.text || '').join('');
const flatten = (nodes) => nodes.flatMap(([id, ...children]) => [id, ...flatten(children)]);

function verifyBlock(block, html, context) {
  // User removed legacy English-page navigation now that all five locales have a header switcher.
  if (block.type === 'note' && ['xjqy1g2vd966v26vd54z', 'd367nxm383j682j98pv1'].includes(block.value.pageHash)) return 0;
  const text = normalize(sourceText(block));
  if (text) assert(visible(html).includes(text), `${context}: missing full source block ${block.id}: ${sourceText(block).slice(0, 100)}`);
  const hrefs = [...html.matchAll(/\bhref="([^"]+)"/g)].map((match) => decode(match[1]));
  for (const token of block.value.tokens || []) {
    if (token.extended?.type !== 'clickAction') continue;
    const action = JSON.parse(token.extended.value);
    if (action.action === 'url') assert(hrefs.includes(action.url), `${context}: missing source link ${action.url}`);
  }
  if (block.type === 'note') {
    assert(hrefs.includes(`https://slashpage.com/shardee/${block.value.pageHash}`), `${context}: missing English source link`);
  }
  return text ? 1 : 0;
}

export async function verifyContent() {
  const results = {};
  for (const [name, count] of [['privacy', 13], ['terms', 16]]) {
    const source = JSON.parse(await readFile(`docs/reference/${name}-source.json`, 'utf8'));
    const page = await readFile(`dist/shardee/${name}/index.html`, 'utf8');
    const article = page.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
    assert(article, `${name}: rendered document article`);
    let checked = 0;
    for (const id of flatten(source.blockTree)) checked += verifyBlock(source.blockMap[id], article, name);
    assert.equal([...article.matchAll(/<h2\b[^>]*\bid="section-\d+"/g)].length, count, `${name}: full clause count`);
    for (let index = 1; index <= count; index++) assert(page.includes(`href="#section-${index}"`), `${name}: TOC section ${index}`);
    assert(checked > 50, `${name}: source verification must check actual full content`);
    results[name] = { clauses: count, textBlocks: checked };
  }
  const source = JSON.parse(await readFile('docs/reference/faq-source.json', 'utf8'));
  const page = await readFile('dist/shardee/faq/index.html', 'utf8');
  const questionNodes = source.blockTree.filter(([id, ...children]) => children.length && ['heading', 'headingToggle'].includes(source.blockMap[id].type));
  assert.equal(questionNodes.length, 18);
  let checked = 0;
  for (const [index, [id, ...children]] of questionNodes.entries()) {
    const detail = page.match(new RegExp(`<details\\b[^>]*\\bid="question-${index + 1}"[^>]*>([\\s\\S]*?)<\\/details>`))?.[1];
    assert(detail, `faq: question ${index + 1} exists in initial HTML`);
    checked += verifyBlock(source.blockMap[id], detail, `faq question ${index + 1}`);
    for (const childId of flatten(children)) checked += verifyBlock(source.blockMap[childId], detail, `faq answer ${index + 1}`);
  }
  const intro = page.match(/<section\b[^>]*class="introduction"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  const notices = page.match(/<aside\b[^>]*class="notices"[^>]*>([\s\S]*?)<\/aside>/)?.[1];
  assert(intro && notices, 'FAQ introduction and notices');
  let noticeSection = false;
  for (const [id] of source.blockTree) {
    const block = source.blockMap[id];
    const text = sourceText(block).trim();
    if (text === '공지 사항') { noticeSection = true; continue; }
    if (text === '자주 묻는 질문') break;
    if (!text) continue;
    checked += verifyBlock(block, noticeSection ? notices : intro, 'FAQ introduction/notices');
  }
  const english = 'https://slashpage.com/shardee/4z7pvx2kz1jw1mek8653';
  assert(!page.includes(`href="${english}"`), 'Legacy English navigation removed');
  results.faq = { questions: 18, textBlocks: checked };
  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log('Verified content fidelity:', JSON.stringify(await verifyContent()));
}
