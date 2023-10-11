import { LOAD_DEPENDENCIES } from '$shared/constants';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { LayoutServerLoad } from './$types';
import { translations } from './translation';

export const load: LayoutServerLoad = async ({ url, depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  return {
    breadcrumbs: buildBreadcrumbs(url.pathname),
    translations: {
      layout: translations[language],
    },
  };
};
