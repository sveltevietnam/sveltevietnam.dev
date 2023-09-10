import { LOAD_DEPENDENCIES } from '$shared/constants';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations = {
  vi: {
    title: 'Tài trợ | Svelte Việt Nam',
    description: 'Chung tay phát triển cộng đồng Svelte Việt Nam',
    keywords: ['tài trợ', 'đóng góp'],
  },
  en: {
    title: 'Sponsor | Svelte Vietnam',
    description: 'Grow together with the Svelte Vietnam community',
    keywords: ['sponsor', 'contribute'],
  },
};

export const load: PageServerLoad = ({ url, depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  const tMeta = metaTranslations[language];
  return {
    breadcrumbs: buildBreadcrumbs(url.pathname),
    translations: {
      page: translations[language],
    },
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.dev/${language}/sponsor`,
    },
  };
};
