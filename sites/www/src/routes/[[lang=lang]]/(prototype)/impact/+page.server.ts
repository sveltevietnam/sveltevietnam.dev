import { LOAD_DEPENDENCIES } from '$shared/constants';
import { createMockedProjects } from '$shared/mocks';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations = {
  vi: {
    title: 'Tác động | Svelte Vietnam',
    description: 'Tác động của Svelte và cộng đồng tại Việt Nam',
    keywords: ['tác động', 'cộng đồng', 'dự án', 'trách nhiệm', 'xã hội'],
  },
  en: {
    title: 'Impact | Svelte Vietnam',
    description: 'Social impact of Svelte and its community in Vietnam',
    keywords: ['impact', 'community', 'project', 'social', 'responsibility'],
  },
};

export const load: PageServerLoad = ({ depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  const tMeta = metaTranslations[language];
  return {
    translations: {
      page: translations[language],
    },
    projects: {
      inNeed: createMockedProjects(2),
      launched: createMockedProjects(2),
    },
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.com/${language}/impact`,
    },
  };
};
