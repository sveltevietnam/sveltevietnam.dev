import ogImageEn from '$shared/assets/images/og/og-coc.en.jpg';
import ogImageVi from '$shared/assets/images/og/og-coc.vi.jpg';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import type { Language } from '$shared/services/i18n';
import { CODE_OF_CONDUCT_PATH, ROOT_URL } from '$shared/services/navigation';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations: Record<Language, App.PageData['meta']> = {
  vi: {
    title: 'Quy tắc ứng xử | Svelte Việt Nam',
    description: 'Quy tắc ứng xử dành cho thành viên trong cộng đồng Svelte Việt Nam',
    keywords: ['quy tắc', 'nội quy', 'điều lệ', 'cộng đồng'],
    og: {
      image: ogImageVi,
    },
  },
  en: {
    title: 'Code of Conduct | Svelte Vietnam',
    description: 'Code of Conduct for members in the Svelte Vietnam community',
    keywords: ['code', 'conduct', 'community', 'rules'],
    og: {
      image: ogImageEn,
    },
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
      canonical: `${ROOT_URL}/${language}${CODE_OF_CONDUCT_PATH}`,
    },
  };
};
