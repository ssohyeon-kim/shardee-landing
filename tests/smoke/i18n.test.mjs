import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { basePath } from '../../deployment.config.mjs';
const locales = ['ko','en','ja','zh-Hant','zh-Hans'];
const pages = ['', 'faq/', 'privacy/', 'terms/'];
const read = path => readFile(path, 'utf8');
const json = async path => JSON.parse(await read(path));
const graph = html => JSON.parse(html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1])['@graph'];
const tags = text => [...text.matchAll(/<\/?[a-z][^>]*>/gi)].map(match => match[0]);
const shape = value => Array.isArray(value) ? value.map(shape) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key,val]) => [key,shape(val)])) : typeof value;

test('all 20 localized pages have coherent entities, links, locale metadata and private-email-free footers', async () => {
  for (const locale of locales) {
    for (const page of pages) {
      const route = `/${locale}/${page}`;
      const html = await read(`dist/shardee${route}index.html`);
      assert(!/Terms of Use \(En\)|Privacy Policy \(En\)|FAQ in English/.test(html), `${route}: no legacy English shortcuts`);
      const data = graph(html);
      const schema = data.find(node => node['@type'] === (page === 'faq/' ? 'FAQPage' : 'WebPage'));
      const url = new URL(html.match(/rel="canonical" href="([^"]+)"/)[1]);
      assert.equal(schema.url, url.href);
      assert.equal(schema.inLanguage, locale);
      assert(data.some(node => node['@type'] === 'Organization'));
      assert(data.some(node => node['@type'] === 'WebSite'));
      const app = data.find(node => node['@type'] === 'SoftwareApplication');
      assert(app && !app.offers && !app.aggregateRating && !app.review);
      assert(!app.inLanguage, 'website locale must not claim app UI language support');
      const market = { ko:['kr','ko','KR'], en:['us','en','US'], ja:['jp','ja','JP'], 'zh-Hant':['tw','zh_TW','TW'], 'zh-Hans':['cn','zh_CN','CN'] }[locale];
      const apple = new URL(app.downloadUrl[0]);
      const google = new URL(app.downloadUrl[1]);
      assert.equal(apple.pathname, `/${market[0]}/app/id6739505769`);
      assert.equal(google.searchParams.get('id'), 'com.shardee.aos');
      assert.equal(google.searchParams.get('hl'), market[1]);
      assert.equal(google.searchParams.get('gl'), market[2]);
      if (!page) {
        const storeButtons = [...html.matchAll(/<div class="store-buttons[^"]*"[^>]*>([\s\S]*?)<\/div>/g)];
        assert.equal(storeButtons.length, 2);
        for (const buttons of storeButtons) {
          assert(buttons[1].includes(`href="${apple.href}"`));
          assert(buttons[1].replaceAll('&amp;', '&').includes(`href="${google.href}"`));
        }
      }
      assert.equal(new Set(data.map(node => node['@id'])).size,data.length);
      const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
      assert(!/ssohyeonkim@gmail.com|hjin9a@naver.com/.test(footer));
      assert(footer.includes('mailto:untitledshatter@gmail.com'));
      for (const target of ['faq/','privacy/','terms/']) assert(footer.includes(`href="${basePath}/${locale}/${target}"`));
      if (page) assert(data.some(node => node['@type'] === 'BreadcrumbList'));
      if (['privacy/','terms/'].includes(page)) {
        const count = page === 'privacy/' ? 13 : 16;
        assert.equal(schema.hasPart.length,count);
        assert.equal(schema.dateModified, page === 'privacy/' ? '2026-10-14' : '2026-10-01');
        for (let i=1;i<=count;i++) assert(html.includes(`id="section-${i}"`));
      }
    }
  }
});

test('each FAQ schema describes exactly its 18 translated, rendered questions and complete answers', async () => {
  for (const locale of locales) {
    const faq = await json(`src/content/translations/${locale}/faq.json`);
    const html = await read(`dist/shardee/${locale}/faq/index.html`);
    const schema = graph(html).find(node => node['@type'] === 'FAQPage');
    assert.equal(schema.mainEntity.length,18);
    for (const [i,item] of faq.items.entries()) {
      const question = schema.mainEntity[i];
      assert.equal(question.name,item.question);
      assert.equal(question.acceptedAnswer.text,item.answer);
      assert(question.url.endsWith(`#${item.id}`));
      const answer = html.match(new RegExp(`<details\\b[^>]*id="${item.id}"[^>]*>([\\s\\S]*?)<\\/details>`))?.[1];
      assert(answer,`${locale}: question exists in initial HTML`);
      // Renderer may add scoped attributes; all answer text and source links are retained.
      const normalize = text => text.replace(/<[^>]*>/g,'').replace(/\s+/g,'');
      assert(normalize(answer).includes(normalize(item.answer)),`${locale}: full answer ${item.id}`);
    }
  }
});

test('translations preserve UI shape, source FAQ identity and the full legal HTML structure', async () => {
  const ko = await json('src/i18n/locales/ko.json');
  const faq = await json('src/content/translations/ko/faq.json');
  for (const locale of locales.filter(locale => locale !== 'ko')) {
    const ui = await json(`src/i18n/locales/${locale}.json`);
    assert.deepEqual(shape(ui),shape(ko),`${locale}: complete UI schema`);
    const translation = await json(`src/content/translations/${locale}/faq.json`);
    assert.equal(translation.items.length,18);
    for (const [i,item] of translation.items.entries()) {
      assert.equal(item.id,faq.items[i].id);
      assert.equal(item.sourceBlockId,faq.items[i].sourceBlockId);
      assert.deepEqual(tags(item.answer),tags(faq.items[i].answer),`${locale}: answer structure/links ${i}`);
    }
    for (const page of ['privacy','terms']) {
      const original = await read(`src/content/legal/${page}.md`);
      const translated = await read(`src/content/translations/${locale}/${page}.md`);
      assert.deepEqual(tags(translated),tags(original),`${locale}: ${page} all explicit HTML IDs/links`);
      const blockKinds = value => value.replace(/^---\n[\s\S]*?\n---\n/,'').split('\n').filter(line => line.trim()).map(line => /^<h2\b/.test(line) ? 'h2' : /^### /.test(line) ? 'h3' : /^(\s*)[-*+] /.test(line) ? `list:${line.match(/^\s*/)[0].length}` : /^>/.test(line) ? 'quote' : 'paragraph');
      assert.deepEqual(blockKinds(translated),blockKinds(original),`${locale}: ${page} complete Markdown blocks and nested lists`);
      const article = (await read(`dist/shardee/${locale}/${page}/index.html`)).match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
      const koArticle = (await read(`dist/shardee/ko/${page}/index.html`)).match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
      const renderedTags = value => [...value.matchAll(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi)].map(match => match[0].startsWith('</') ? '/' + match[1] : match[1]);
      assert.deepEqual(renderedTags(article),renderedTags(koArticle),`${locale}: ${page} complete rendered document structure`);
      assert(!/[가-힣]/u.test(translated.replaceAll('김소현','').replaceAll('채혜진','').replaceAll('디아로','').replaceAll('샤디','')), `${locale}: no untranslated legal paragraphs`);
      const toc = await json(`src/content/translations/${locale}/${page}-toc.json`);
      assert.equal(toc.length,page === 'privacy' ? 13 : 16);
      for (const section of toc) {
        const heading = translated.match(new RegExp(`<h2 id="${section.id}">(.*?)<\\/h2>`))?.[1];
        assert.equal(heading?.replace(/<[^>]*>/g,''),section.text);
      }
    }
  }
});

test('forced query overrides route, while explicit locale URLs stay stable and aliases use saved/browser language', async () => {
  const html = await read('dist/shardee/index.html');
  const script = html.match(/<script\b[^>]*id="locale-routing"[^>]*>([\s\S]*?)<\/script>/)[1];
  const run = ({url=`https://site.test${basePath}/`,locale,page='home',languages=['ko'],saved,denied=false}) => {
    const stored = new Map(saved ? [['shardee-locale',saved]] : []);
    let destination;
    const context = { URL, navigator: { languages },
      document: { querySelector: () => ({content:JSON.stringify({basePath,locale,page})}) },
      location: { href:url, replace: value => {destination=value;} },
      localStorage: {getItem:key=> {if(denied)throw Error();return stored.get(key);},setItem:(key,value)=>{if(denied)throw Error();stored.set(key,value);}},
    };
    vm.runInNewContext(script,context);
    return {destination,saved:stored.get('shardee-locale')};
  };
  assert.deepEqual(run({url:`https://site.test${basePath}/privacy/?lang=en&ref=test#section-11`,page:'privacy'}),{destination:`${basePath}/en/privacy/?ref=test#section-11`,saved:'en'});
  assert.equal(run({url:`https://site.test${basePath}/ja/terms/?lang=zh-TW`,locale:'ja',page:'terms'}).destination,`${basePath}/zh-Hant/terms/`);
  assert.equal(run({url:`https://site.test${basePath}/en/?lang=ko`,locale:'en'}).destination,`${basePath}/ko/`);
  assert.equal(run({url:`https://site.test${basePath}/ja/`,locale:'ja',languages:['en'],saved:'ko'}).destination,undefined);
  assert.equal(run({languages:['fr','zh-TW']}).destination,`${basePath}/zh-Hant/`);
  assert.equal(run({languages:['zh-CN']}).destination,`${basePath}/zh-Hans/`);
  assert.equal(run({languages:['fr']}).destination,`${basePath}/ko/`);
  assert.equal(run({languages:['en'],saved:'ja'}).destination,`${basePath}/ja/`);
  assert.equal(run({languages:['en'],saved:'ja',denied:true}).destination,`${basePath}/en/`);
  assert.equal(run({url:`https://site.test${basePath}/?lang=en-GB`}).destination,`${basePath}/en/`);
  assert.equal(run({url:`https://site.test${basePath}/missing/`,page:'404'}).destination,undefined);
});
