import { LOAD_DEPENDENCIES } from '$shared/constants';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations = {
  vi: {
    title: 'Quy tắc ứng xử | Svelte Vietnam',
    description: 'Quy tắc ứng xử dành cho thành viên trong cộng đồng Svelte Vietnam',
    keywords: ['quy tắc', 'nội quy', 'điều lệ', 'cộng đồng'],
  },
  en: {
    title: 'Code of Conduct | Svelte Vietnam',
    description: 'Code of Conduct for members in the Svelte Vietnam community',
    keywords: ['code', 'conduct', 'community', 'rules'],
  },
};

export const load: PageServerLoad = async ({ url, depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  const tMeta = metaTranslations[language];
  return {
    breadcrumbs: buildBreadcrumbs(url.pathname),
    translations: {
      page: translations[language],
    },
    meta: {
      ...tMeta,
      canonical: `https://sveltevietnam.dev/${language}/code-of-conduct`,
    },
  };
};
