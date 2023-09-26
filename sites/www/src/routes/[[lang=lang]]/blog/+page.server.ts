import { LOAD_DEPENDENCIES } from '$shared/constants';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { translations as pageT } from './_page/translation';

const metaTranslations = {
  vi: {
    title: 'Blog | Svelte Việt Nam',
    description: '',
    keywords: ['blog', 'viết', 'chia sẻ', 'cộng đồng', 'tham gia', 'đóng góp'],
  },
  en: {
    title: 'Blog | Svelte Vietnam',
    description: '',
    keywords: ['blog', 'writing', 'sharing', 'community', 'involvement', 'contribution'],
  },
};

export const load: PageServerLoad = async ({ url, depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  const tMeta = metaTranslations[language];
  return {
    breadcrumbs: buildBreadcrumbs(url.pathname),
    translations: {
      page: pageT[language],
    },
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.dev/${language}/blog`,
    },
  };
};
