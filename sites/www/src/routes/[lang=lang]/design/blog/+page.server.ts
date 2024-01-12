import { LOAD_DEPENDENCIES } from '$shared/constants';
import { DESIGN_BLOG_PATH } from '$shared/services/navigation';
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
	const tMeta = metaTranslations[language];
	return {
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: pageT[language],
		},
		meta: {
			...tMeta,
			canonical: `${url.origin}/${language}${DESIGN_BLOG_PATH}`,
		},
	};
};
