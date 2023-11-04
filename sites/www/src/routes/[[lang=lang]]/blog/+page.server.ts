import { mail } from '$server/actions/mail/mail.server';
import ogImage from '$shared/assets/images/og/og-blog.jpg';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import type { Language } from '$shared/services/i18n';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { Actions, PageServerLoad } from './$types';
import { INTERNAL_POSTS, EXTERNAL_POSTS } from './_page/data';
import { translations as pageT } from './_page/translation';

const metaTranslations: Record<Language, App.PageData['meta']> = {
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
      og: {
        image: ogImage,
      },
    },
    posts: {
      internal: INTERNAL_POSTS,
      external: EXTERNAL_POSTS,
    },
  };
};

export const actions: Actions = {
  mail: async (event) => mail(event, 'blog'),
};
