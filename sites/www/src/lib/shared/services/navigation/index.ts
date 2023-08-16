import { delocalizeUrl } from '@libs/utils/url';

import type { Language } from '$shared/services/i18n';
import { LANGUAGES } from '$shared/services/i18n';
import { translations } from '$shared/services/i18n/translations/navigation';

export const SITEMAP_PATH = '/sitemap.xml';
export const RSS_PATH = '/rss.xml';

export const HOME_PATH = '/';
export const BLOG_PATH = '/blog';
export const EVENTS_PATH = '/events';
export const JOBS_PATH = '/jobs';
export const IMPACT_PATH = '/impact';
export const PEOPLE_PATH = '/people';
export const SPONSOR_PATH = '/sponsor';
export const CODE_OF_CONDUCT_PATH = '/code-of-conduct';
export const DESIGN_PATH = '/design';
export const DESIGN_TYPOGRAPHY_PATH = '/design/typography';

export function getPathLabel(path: string, lang: Language) {
  const t = translations[lang];
  switch (path) {
    case HOME_PATH:
      return t.home;
    case BLOG_PATH:
      return t.blog;
    case EVENTS_PATH:
      return t.events;
    case JOBS_PATH:
      return t.jobs;
    case IMPACT_PATH:
      return t.impact;
    case PEOPLE_PATH:
      return t.people;
    case SPONSOR_PATH:
      return t.sponsor;
    case CODE_OF_CONDUCT_PATH:
      return t.codeOfConduct;
    case DESIGN_PATH:
      return t.design;
    case DESIGN_TYPOGRAPHY_PATH:
      return t.typography;
    default:
      return '';
  }
}

export const HEADER_PATHS = [EVENTS_PATH, JOBS_PATH, IMPACT_PATH, PEOPLE_PATH, SPONSOR_PATH];
export const FOOTER_PATHS = [HOME_PATH, ...HEADER_PATHS];
export const ALL_PATHS = [
  HOME_PATH,
  BLOG_PATH,
  EVENTS_PATH,
  JOBS_PATH,
  IMPACT_PATH,
  PEOPLE_PATH,
  SPONSOR_PATH,
  CODE_OF_CONDUCT_PATH,
  DESIGN_PATH,
  DESIGN_TYPOGRAPHY_PATH,
];

export function isCurrentPage(pathname: string, href: string) {
  const delocalizedPathname = delocalizeUrl(pathname, LANGUAGES);
  const delocalizedHref = delocalizeUrl(href, LANGUAGES);
  if (delocalizedHref === HOME_PATH) {
    return delocalizedPathname === href;
  }
  return delocalizedPathname.startsWith(href);
}

export type Breadcrumb = {
  label: string;
  href?: string;
};
