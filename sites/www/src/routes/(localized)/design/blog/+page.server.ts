import { LOAD_DEPENDENCIES } from '$lib/constants';
import { prepareRoutePageData } from '$lib/routing/routing.server';

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

export const load: PageServerLoad = ({ depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(lang, 'design_blog'),
		translations: {
			page: pageT[lang],
		},
		meta: metaTranslations[lang],
	};
};
