import { LOAD_DEPENDENCIES } from '$lib/constants';
import { createMockedContributors } from '$lib/data/mocks';
import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations = {
	vi: {
		title: 'Con người | Svelte Việt Nam',
		description: 'Nhân tố Việt trong Cộng đồng Svelte',
		keywords: ['con người', 'cộng đồng', 'đóng góp', 'đề cử'],
	},
	en: {
		title: 'People | Svelte Vietnam',
		description: 'People of Vietnam in the Svelte community',
		keywords: ['people', 'contributor', 'nomination', 'community'],
	},
};

export const load: PageServerLoad = ({ depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(lang, 'people'),
		translations: {
			page: translations[lang],
		},
		contributors: createMockedContributors(),
		meta: metaTranslations[lang],
	};
};
