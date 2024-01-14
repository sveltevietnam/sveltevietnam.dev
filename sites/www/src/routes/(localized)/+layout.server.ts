import { buildBreadcrumbs } from '$lib/routing/routing.server';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	return {
		breadcrumbs: buildBreadcrumbs(url.pathname),
	};
};
