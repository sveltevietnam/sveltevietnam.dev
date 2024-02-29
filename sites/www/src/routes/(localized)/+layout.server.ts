import { buildBreadcrumbs } from '$lib/routing/routing.server';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url, locals }) => {
	return {
		breadcrumbs: buildBreadcrumbs(url.pathname),
		supportedLanguages: ['en', 'vi'],
		settings: locals.settings,
	};
};
