import { site } from './site';
import type { Locale } from '../i18n';

/** Default storefront for each selected site language. This does not change a user's store account country. */
const markets: Record<Locale, { country: string; language: string }> = {
  ko: { country: 'KR', language: 'ko' },
  en: { country: 'US', language: 'en' },
  ja: { country: 'JP', language: 'ja' },
  'zh-Hant': { country: 'TW', language: 'zh_TW' },
  'zh-Hans': { country: 'CN', language: 'zh_CN' },
};

export function getStoreLinks(locale: Locale) {
  const market = markets[locale];
  const apple = new URL(site.stores.apple);
  apple.pathname = apple.pathname.replace(/^\/[a-z]{2}\//, `/${market.country.toLowerCase()}/`);
  const google = new URL(site.stores.google);
  google.searchParams.set('hl', market.language);
  google.searchParams.set('gl', market.country);
  return { apple: apple.href, google: google.href };
}
