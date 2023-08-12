import { LOAD_DEPENDENCIES } from '$shared/constants';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations = {
  vi: {
    title: 'Về thiết kế | Svelte Vietnam',
    description: 'Đôi lời về thiết kế và logo của Svelte Vietnam',
    keywords: ['thiết kế', 'ý tưởng', 'sáng tạo', 'cảm hứng', 'logo'],
  },
  en: {
    title: 'Design | Svelte Vietnam',
    description: 'A few words about the design and logo of Svelte Vietnam',
    keywords: ['design', 'idea', 'creativity', 'inspiration', 'logo'],
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
      canonical: `https://sveltevietnam.com/${language}/design`,
    },
  };
};
