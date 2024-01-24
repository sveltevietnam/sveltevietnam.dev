import { LOAD_DEPENDENCIES } from '$lib/constants';
import { preparePageData } from '$lib/data/events';
import { buildBreadcrumbs, type Breadcrumb } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';
import { event, structure } from './_page/data';
import { translations as pageT } from './_page/translation';

export const load: PageServerLoad = async ({ url, depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const prepared = preparePageData(url, lang, event, structure);
	return {
		...prepared,
		breadcrumbs: [
			...buildBreadcrumbs(url.pathname),
			{ label: prepared.event.title },
		] satisfies Breadcrumb[],
		translations: {
			page: pageT[lang],
		},
	};
};
