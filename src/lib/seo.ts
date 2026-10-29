import { site } from '../config/site';
import { getStoreLinks } from '../config/stores';
import { localizedPath, pageTitle, t, type Locale, type Page } from '../i18n';
export interface PageDetails {
  locale: Locale; page: Page; title: string; description: string; canonicalPath: string;
  updated?: string; version?: string;
  questions?: { id: string; question: string; answer: string }[];
  sections?: { id: string; text: string }[];
}
export function structuredData(origin: URL, details: PageDetails) {
  const { locale, page, title, description, canonicalPath, updated, version, questions, sections } = details;
  const absolute = (path: string) => new URL(path, origin).href;
  const root = absolute('/');
  const url = absolute(canonicalPath);
  const organization = `${root}#organization`;
  const website = `${root}#website`;
  const app = `${root}#application`;
  const ui = t(locale);
  const stores = getStoreLinks(locale);
  const pageNode = {
    '@type': page === 'faq' ? 'FAQPage' : 'WebPage', '@id': `${url}#webpage`, url,
    name: title, description, inLanguage: locale,
    isPartOf: { '@id': website }, about: { '@id': app }, publisher: { '@id': organization },
    ...(page !== 'home' && { breadcrumb: { '@id': `${url}#breadcrumb` } }),
    ...(updated && { dateModified: updated }), ...(version && { version }),
    ...(page === 'home' && { mainEntity: { '@id': app } }),
    ...(questions && { mainEntity: questions.map(item => ({
      '@type': 'Question', '@id': `${url}#${item.id}`, url: `${url}#${item.id}`,
      name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer, inLanguage: locale },
    })) }),
    ...(sections && { hasPart: sections.map(section => ({ '@type': 'WebPageElement', '@id': `${url}#${section.id}`, name: section.text, url: `${url}#${section.id}` })) }),
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': organization, name: site.business.name, alternateName: 'DIARO', url: root, email: site.email },
      { '@type': 'WebSite', '@id': website, name: '샤디 Shardee', url: root, inLanguage: ['ko','en','ja','zh-Hant','zh-Hans'], publisher: { '@id': organization } },
      { '@type': 'SoftwareApplication', '@id': app, name: 'Shardee', alternateName: '샤디', url: absolute(localizedPath(locale)), description: ui.meta.homeDescription,
        applicationCategory: 'MultimediaApplication', operatingSystem: 'iOS, Android',
        image: absolute('/brand/app-icon.jpg'), downloadUrl: [stores.apple, stores.google],
        publisher: { '@id': organization }, sameAs: [stores.apple, stores.google] },
      pageNode,
      ...(page !== 'home' ? [{ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
        { '@type': 'ListItem', position: 1, name: ui.nav.home, item: absolute(localizedPath(locale)) },
        { '@type': 'ListItem', position: 2, name: pageTitle(locale, page), item: url },
      ] }] : []),
    ],
  };
}
export const serializeJsonLd = (value: unknown) => JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
