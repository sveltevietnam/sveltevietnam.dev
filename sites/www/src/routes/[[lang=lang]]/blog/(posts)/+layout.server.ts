import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
  return {
    breadcrumbs: buildBreadcrumbs(url.pathname),
  };
};
