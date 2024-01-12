import { LOAD_DEPENDENCIES } from '$shared/constants';
import { createMockedContributors } from '$shared/mocks';
import { PEOPLE_PATH } from '$shared/services/navigation';
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
	const tMeta = metaTranslations[language];
	return {
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: translations[language],
		},
		contributors: createMockedContributors(),
		meta: {
			...tMeta,
			canonical: `${url.origin}/${language}${PEOPLE_PATH}`,
		},
	};
};
