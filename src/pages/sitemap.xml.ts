import type { APIRoute } from 'astro';
import { locales, localizedPath, aliasPath, type Page } from '../i18n';
export const GET: APIRoute = ({ site }) => {
  const pages: Page[] = ['home', 'faq', 'privacy', 'terms'];
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
  const absolute = (path: string) => escape(new URL(path, site).href);
  const urls = pages.flatMap(page => locales.map(locale => `<url><loc>${absolute(localizedPath(locale, page))}</loc>${locales.map(other => `<xhtml:link rel="alternate" hreflang="${other}" href="${absolute(localizedPath(other, page))}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${absolute(aliasPath(page))}"/></url>`)).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
