import { LOAD_DEPENDENCIES } from '$shared/constants';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations = {
  vi: {
    title: 'Tài trợ | Svelte Vietnam',
    description: 'Chung tay phát triển cộng đồng Svelte Vietnam',
    keywords: ['tài trợ', 'đóng góp'],
  },
  en: {
    title: 'Sponsor | Svelte Vietnam',
    description: 'Grow together with the Svelte Vietnam community',
    keywords: ['sponsor', 'contribute'],
  },
};

export const load: PageServerLoad = ({ depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  const tMeta = metaTranslations[language];
  return {
    translations: {
      page: translations[language],
    },
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.com/${language}/sponsor`,
    },
  };
};
