import type { FaqItem } from '../content/faq';
import type { Locale } from '../i18n';
import type { MarkdownInstance } from 'astro';
export interface FaqContent {
  introduction: { heading: boolean; text: string }[];
  notices: string[]; items: FaqItem[]; categories: string[];
}
const faqModules = import.meta.glob<{ default: FaqContent }>('../content/translations/*/faq.json', { eager: true });
const legalModules = import.meta.glob<MarkdownInstance<Record<string, unknown>>>('../content/{legal,translations/*}/*.md', { eager: true });
const tocModules = import.meta.glob<{ default: { id: string; text: string }[] }>('../content/{legal,translations/*}/*-toc.json', { eager: true });
export const getFaq = (locale: Locale): FaqContent => {
  const module = faqModules[`../content/translations/${locale}/faq.json`];
  if (!module) throw new Error(`Missing FAQ translation: ${locale}`);
  return module.default;
};
export const getLegal = (locale: Locale, page: 'privacy' | 'terms') => {
  const folder = locale === 'ko' ? '../content/legal' : `../content/translations/${locale}`;
  const content = legalModules[`${folder}/${page}.md`];
  const toc = tocModules[`${folder}/${page}-toc.json`];
  if (!content || !toc) throw new Error(`Missing legal translation: ${locale}/${page}`);
  return { Content: content.Content, toc: toc.default };
};
