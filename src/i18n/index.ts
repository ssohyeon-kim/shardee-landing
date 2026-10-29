import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import hant from './locales/zh-Hant.json';
import hans from './locales/zh-Hans.json';
export const locales = ['ko', 'en', 'ja', 'zh-Hant', 'zh-Hans'] as const;
export type Locale = typeof locales[number];
export type Page = 'home' | 'faq' | 'privacy' | 'terms' | '404';
export type Messages = typeof ko;
const messages: Record<Locale, Messages> = { ko, en, ja, 'zh-Hant': hant, 'zh-Hans': hans };
export const names: Record<Locale, string> = { ko: '한국어', en: 'English', ja: '日本語', 'zh-Hant': '繁體中文', 'zh-Hans': '简体中文' };
export const ogLocales: Record<Locale, string> = { ko: 'ko_KR', en: 'en_US', ja: 'ja_JP', 'zh-Hant': 'zh_TW', 'zh-Hans': 'zh_CN' };
export const t = (locale: Locale) => messages[locale];
export const localizedPath = (locale: Locale, page: Page = 'home') => `/${locale}/${page === 'home' ? '' : `${page}/`}`;
export const aliasPath = (page: Page) => page === 'home' ? '/' : `/${page}/`;
export const localeFromPath = (path: string): Locale | undefined => locales.find(locale => path.split('/')[1] === locale);
export const pageFromPath = (path: string): Page => {
  const parts = path.split('/').filter(Boolean);
  if (locales.includes(parts[0] as Locale)) parts.shift();
  return ['faq','privacy','terms','404'].includes(parts[0]) ? parts[0] as Page : 'home';
};
export const pageTitle = (locale: Locale, page: Page) => {
  const ui = t(locale);
  return page === '404' ? ui.error.title : ui.meta[`${page}Title` as keyof typeof ui.meta];
};
export const pageDescription = (locale: Locale, page: Page) => {
  const ui = t(locale);
  return page === '404' ? ui.error.description : ui.meta[`${page}Description` as keyof typeof ui.meta];
};
