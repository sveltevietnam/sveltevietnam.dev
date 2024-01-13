import { prepareRoutePageData } from '$client/contexts/navigation';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { translations as pageT } from './_page/translation';

const metaTranslations = {
	vi: {
		title: 'Blog | Thiết Kế | Svelte Việt Nam',
		description: 'Tổng quan về thiết kế và các thành phần thường gặp trong blog',
		keywords: ['thiết kế', 'hệ thống', 'css', 'blog'],
	},
	en: {
		title: 'Blog | Design | Svelte Vietnam',
		description: 'An overview of the design and common components for writing blog posts',
		keywords: ['design', 'css', 'system', 'blog'],
	},
};

export const load: PageServerLoad = ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(language, 'design_blog'),
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: pageT[language],
		},
		meta: metaTranslations[language],
	};
};
