import { LOAD_DEPENDENCIES } from '$shared/constants';
import { DESIGN_COLORS_PATH } from '$shared/services/navigation';
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
	const tMeta = metaTranslations[language];
	return {
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: pageT[language],
		},
		meta: {
			...tMeta,
			canonical: `${url.origin}/${language}${DESIGN_COLORS_PATH}`,
		},
	};
};
