import { prepareRoutePageData } from '$client/contexts/navigation';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { createMockedContributors } from '$lib/data/mocks';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

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

export const load: PageServerLoad = ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(language, 'people'),
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: translations[language],
		},
		contributors: createMockedContributors(),
		meta: metaTranslations[language],
	};
};
