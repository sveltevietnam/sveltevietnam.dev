import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, route, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		editUrl: route.id
			? encodeURI(
					`https://github.com/sveltevietnam/sveltevietnam.dev/edit/v1/sites/sveltevietnam.dev/src/routes${route.id}/+page.svelte`,
				)
			: undefined,
		sharedSettings: locals.sharedSettings,
	};
};
