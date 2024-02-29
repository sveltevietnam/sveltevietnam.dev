import { LOAD_DEPENDENCIES } from '$lib/constants';
import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(locals.settings.language, 'blueScreenOfDeath'),
		meta: {
			title: 'Blue Screen of Death | Svelte Vietnam',
			description: '',
		},
	};
};
