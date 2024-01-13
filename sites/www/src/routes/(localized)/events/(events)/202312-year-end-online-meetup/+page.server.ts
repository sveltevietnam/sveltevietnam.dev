import { LOAD_DEPENDENCIES } from '$lib/constants';
import { preparePageData } from '$lib/data/events';
import type { Breadcrumb } from '$shared/services/navigation';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { event, structure } from './_page/data';
import { translations as pageT } from './_page/translation';

export const load: PageServerLoad = async ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const prepared = preparePageData(url, language, event, structure);
	return {
		...prepared,
		breadcrumbs: [
			...buildBreadcrumbs(url.pathname),
			{ label: prepared.event.title },
		] satisfies Breadcrumb[],
		translations: {
			page: pageT[language],
		},
	};
};
