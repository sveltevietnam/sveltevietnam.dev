import type { Language } from '$shared/services/i18n';
import { translations } from '$shared/services/i18n/translations/navigation';

export const getHomeHref = (lang: Language) => `/${lang}`;
export const getEventsHref = (lang: Language) => `/${lang}/events`;
export const getJobsHref = (lang: Language) => `/${lang}/jobs`;
export const getImpactHref = (lang: Language) => `/${lang}/impact`;
export const getPeopleHref = (lang: Language) => `/${lang}/people`;
export const getSponsorHref = (lang: Language) => `/${lang}/sponsor`;
export const getCodeOfConductHref = (lang: Language) => `/${lang}/code-of-conduct`;

export const pages = (lang: Language, scope?: 'all') => {
  const t = translations[lang];
  const pages = [
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
  if (scope === 'all') {
    pages.push({
      href: getCodeOfConductHref(lang),
      label: t.codeOfConduct,
    });
  }
  return pages;
};
