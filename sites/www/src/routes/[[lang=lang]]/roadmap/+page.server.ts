import { LOAD_DEPENDENCIES } from '$shared/constants';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { translations as pageT } from './_page/translation';

const metaTranslations = {
  vi: {
    title: 'Lộ trình | Svelte Vietnam',
    description: 'Kế hoạch phát triển trang web sveltevietnam.dev',
    keywords: ['mốc', 'lộ trình', 'kế hoạch'],
  },
  en: {
    title: 'Roadmap | Svelte Vietnam',
    description: 'Development plan for sveltevietnam.dev site',
    keywords: ['milestone', 'roadmap', 'plan', 'release'],
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
    events: {
      upcoming: [],
      past: [],
    },
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.dev/${language}/roadmap`,
    },
  };
};
