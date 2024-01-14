import { LOAD_DEPENDENCIES } from '$lib/constants';
import { prepareRoutePageData } from '$lib/contexts/navigation';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { translations as pageT } from './_page/translation';

const metaTranslations = {
	vi: {
		title: 'Màu sắc | Thiết Kế | Svelte Việt Nam',
		description: 'Tổng quan về thiết kế cho hệ thống màu sắc của Svelte Việt Nam',
		keywords: ['thiết kế', 'màu sắc', 'bảng màu', 'hệ thống', 'css'],
	},
	en: {
		title: 'Colors | Design | Svelte Vietnam',
		description: 'An overview of the color design for Svelte Vietnam',
		keywords: ['design', 'color', 'palette', 'system', 'css'],
	},
};

export const load: PageServerLoad = ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(language, 'design_colors'),
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: pageT[language],
		},
		meta: metaTranslations[language],
	};
};
