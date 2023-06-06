import type { Language } from '$shared/services/i18n';
import { translations } from '$shared/services/i18n/translations/navigation';

export const getRSSHref = () => '/rss.xml';
export const getSitemapHref = () => '/sitemap.xml';

export const getHomeHref = (lang: Language) => `/${lang}`;
export const getEventsHref = (lang: Language) => `/${lang}/events`;
export const getJobsHref = (lang: Language) => `/${lang}/jobs`;
export const getImpactHref = (lang: Language) => `/${lang}/impact`;
export const getPeopleHref = (lang: Language) => `/${lang}/people`;
export const getSponsorHref = (lang: Language) => `/${lang}/sponsor`;
export const getCodeOfConductHref = (lang: Language) => `/${lang}/code-of-conduct`;

export const pages = (lang: Language, scope?: 'with-home') => {
  const t = translations[lang];
  let pages = [
    {
      href: getEventsHref(lang),
      label: t.events,
    },
    {
      href: getJobsHref(lang),
      label: t.jobs,
    },
    {
      href: getImpactHref(lang),
      label: t.impact,
    },
    {
      href: getPeopleHref(lang),
      label: t.people,
    },
    {
      href: getSponsorHref(lang),
      label: t.sponsor,
    },
  ];
  if (scope === 'with-home') {
    pages = [
      {
        href: getHomeHref(lang),
        label: t.home,
      },
      ...pages,
    ];
  }
  return pages;
};

export function isCurrentPage(pathname: string, href: string) {
  if (href.length === 3) {
    return pathname === href;
  }
  return pathname.startsWith(href);
}
