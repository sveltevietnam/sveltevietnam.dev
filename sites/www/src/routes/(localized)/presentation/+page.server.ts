import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';

export const ssr = false;

export const load: PageServerLoad = ({ locals }) => {
	const lang = locals.settings.language;
	return {
		route: prepareRoutePageData(lang, 'presentation'),
	}
}
