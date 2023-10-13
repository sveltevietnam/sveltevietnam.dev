import { LOAD_DEPENDENCIES } from '$shared/constants';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import { EXTERNAL_POSTS, INTERNAL_POSTS } from '../_page/data';

import type { LayoutServerLoad } from './$types';
import { translations } from './translation';

export const load: LayoutServerLoad = async ({ url, depends, locals: { language } }) => {
  let morePosts = INTERNAL_POSTS;
  const slug = url.pathname.split('/').at(-1);
  if (slug) {
    morePosts = morePosts.filter((p) => p.slug !== slug);
  }

  depends(LOAD_DEPENDENCIES.LANGUAGE);
  return {
    breadcrumbs: buildBreadcrumbs(url.pathname),
    more: {
      external: morePosts.slice(0, 1),
      internal: EXTERNAL_POSTS.slice(0, 1),
    },
    translations: {
      layout: translations[language],
    },
  };
};
