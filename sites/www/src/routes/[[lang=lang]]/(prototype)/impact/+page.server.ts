import { LOAD_DEPENDENCIES } from '$shared/constants';
import { createMockedProjects } from '$shared/mocks';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations = {
  vi: {
    title: 'Tác động | Svelte Việt Nam',
    description: 'Tác động của Svelte và cộng đồng tại Việt Nam',
    keywords: ['tác động', 'cộng đồng', 'dự án', 'trách nhiệm', 'xã hội'],
  },
  en: {
    title: 'Impact | Svelte Vietnam',
    description: 'Social impact of Svelte and its community in Vietnam',
    keywords: ['impact', 'community', 'project', 'social', 'responsibility'],
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
    projects: {
      inNeed: createMockedProjects(2),
      launched: createMockedProjects(2),
    },
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.dev/${language}/impact`,
    },
  };
};
