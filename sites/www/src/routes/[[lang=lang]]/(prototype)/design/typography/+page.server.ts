import { DESIGN_TYPOGRAPHY_PATH, ROOT_URL } from '$shared/services/navigation';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url, locals: { language } }) => {
  return {
    breadcrumbs: buildBreadcrumbs(url.pathname),
    meta: {
      title: 'Typography | Svelte Việt Nam',
      description: 'Typography Design of Svelte Vietnam',
      keywords: ['typography', 'design', 'logo'],
      canonical: `${ROOT_URL}/${language}${DESIGN_TYPOGRAPHY_PATH}`,
    },
  };
};
