import Mustache from 'mustache';

import { LANGUAGES } from '$shared/services/i18n';
import {
  BLOG_PATH,
  CODE_OF_CONDUCT_PATH,
  DESIGN_PATH,
  DESIGN_TYPOGRAPHY_PATH,
  EVENTS_PATH,
  IMPACT_PATH,
  JOBS_PATH,
  PEOPLE_PATH,
  SPONSOR_PATH,
} from '$shared/services/navigation';
import { toW3CDate } from '$shared/utils/datetime';

import type { RequestHandler } from './$types';
import template from './sitemap.template.xml?raw';

/** https://www.sitemaps.org/protocol.html */
type SiteMapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: Array<{
    hreflang: string;
    href: string;
  }>;
};

export const GET: RequestHandler = ({ url }) => {
  const urls: SiteMapUrl[] = [
    ...makeUrl(url.origin, {
      loc: '',
      lastmod: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
      changefreq: 'monthly',
      priority: 0.5,
    }),
    ...makeUrl(url.origin, {
      loc: BLOG_PATH,
      lastmod: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
      changefreq: 'monthly',
      priority: 0.9,
    }),
    ...makeUrl(url.origin, {
      loc: EVENTS_PATH,
      lastmod: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
      changefreq: 'monthly',
      priority: 0.8,
    }),
    ...makeUrl(url.origin, {
      loc: JOBS_PATH,
      lastmod: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
      changefreq: 'monthly',
      priority: 0.7,
    }),
    ...makeUrl(url.origin, {
      loc: IMPACT_PATH,
      lastmod: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
      changefreq: 'monthly',
      priority: 0.6,
    }),
    ...makeUrl(url.origin, {
      loc: PEOPLE_PATH,
      lastmod: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
      changefreq: 'yearly',
      priority: 0.5,
    }),
    ...makeUrl(url.origin, {
      loc: SPONSOR_PATH,
      lastmod: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
      changefreq: 'yearly',
      priority: 0.4,
    }),
    ...makeUrl(url.origin, {
      loc: CODE_OF_CONDUCT_PATH,
      lastmod: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
      changefreq: 'yearly',
      priority: 0.3,
    }),
    ...makeUrl(url.origin, {
      loc: DESIGN_PATH,
      lastmod: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
      changefreq: 'yearly',
      priority: 0.2,
    }),
    ...makeUrl(url.origin, {
      loc: DESIGN_TYPOGRAPHY_PATH,
      lastmod: toW3CDate(parseInt(__BUILD_TIMESTAMP__, 10)),
      changefreq: 'yearly',
      priority: 0.2,
    }),
  ];
  const xml = Mustache.render(template, { urls });
  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml',
  };
  return new Response(xml, { headers });
};

function makeUrl(origin: string, url: SiteMapUrl): SiteMapUrl[] {
  return LANGUAGES.map((locLang) => ({
    ...url,
    loc: `${origin}/${locLang}${url.loc}`,
    alternates:
      url.alternates ??
      LANGUAGES.map((lang) => ({
        href: `${origin}/${lang}${url.loc}`,
        hreflang: lang,
      })),
  }));
}
