import { LOAD_DEPENDENCIES } from '$lib/constants';
import { prepareRoutePageData } from '$lib/contexts/navigation';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations = {
	vi: {
		title: 'Thiết kế | Svelte Việt Nam',
		description: 'Đôi lời về thiết kế và logo của Svelte Việt Nam',
		keywords: ['thiết kế', 'ý tưởng', 'sáng tạo', 'cảm hứng', 'logo'],
	},
	en: {
		title: 'Design | Svelte Vietnam',
		description: 'A few words about the design and logo of Svelte Vietnam',
		keywords: ['design', 'idea', 'creativity', 'inspiration', 'logo'],
	},
};

export const load: PageServerLoad = ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(language, 'design'),
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: translations[language],
		},
		meta: metaTranslations[language],
	};
};
