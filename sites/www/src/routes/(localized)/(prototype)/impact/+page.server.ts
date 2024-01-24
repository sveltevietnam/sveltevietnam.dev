import { LOAD_DEPENDENCIES } from '$lib/constants';
import { createMockedProjects } from '$lib/data/mocks';
import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations = {
	vi: {
		title: 'Tác động | Svelte Việt Nam',
		description: 'Tác động của Svelte và cộng đồng tại Việt Nam',
		keywords: ['tác động', 'cộng đồng', 'dự án', 'trách nhiệm', 'xã hội'],
	},
	en: {
		title: 'Impact | Svelte Vietnam',
		description: 'Social impact of Svelte and its community in Vietnam',
		keywords: ['impact', 'community', 'project', 'social', 'responsibility'],
	},
};

export const load: PageServerLoad = ({ depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(lang, 'impact'),
		translations: {
			page: translations[lang],
		},
		projects: {
			inNeed: createMockedProjects(2),
			launched: createMockedProjects(2),
		},
		meta: metaTranslations[lang],
	};
};
