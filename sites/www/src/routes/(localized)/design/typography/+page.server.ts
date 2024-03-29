import { LOAD_DEPENDENCIES } from '$lib/constants';
import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';

const metaTranslations = {
	vi: {
		title: 'Chữ viết | Thiết Kế | Svelte Việt Nam',
		description: 'Tổng quan về thiết kế cho hệ thống chữ viết của Svelte Việt Nam',
		keywords: ['thiết kế', 'văn bản', 'chữ viết', 'hệ thống', 'css', 'inter', 'font'],
	},
	en: {
		title: 'Typography | Design | Svelte Vietnam',
		description: 'An overview of the typography design for Svelte Vietnam',
		keywords: ['design', 'typography', 'text', 'writing', 'system', 'css', 'inter', 'font'],
	},
};

export const load: PageServerLoad = ({ depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(lang, 'design_typography'),
		translations: {
			page: {
				title: lang === 'en' ? 'Typography' : 'Chữ viết',
			},
		},
		meta: metaTranslations[lang],
	};
};
