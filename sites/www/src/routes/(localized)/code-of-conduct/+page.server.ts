import ogImageEn from '$lib/assets/images/og/og-coc.en.jpg';
import ogImageVi from '$lib/assets/images/og/og-coc.vi.jpg';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations: Record<App.Language, App.PageData['meta']> = {
	vi: {
		title: 'Quy tắc ứng xử | Svelte Việt Nam',
		description: 'Quy tắc ứng xử dành cho thành viên trong cộng đồng Svelte Việt Nam',
		keywords: ['quy tắc', 'nội quy', 'điều lệ', 'cộng đồng'],
		og: {
			image: ogImageVi,
		},
	},
	en: {
		title: 'Code of Conduct | Svelte Vietnam',
		description: 'Code of Conduct for members in the Svelte Vietnam community',
		keywords: ['code', 'conduct', 'community', 'rules'],
		og: {
			image: ogImageEn,
		},
	},
};

export const load: PageServerLoad = async ({ depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(lang, 'codeOfConduct'),
		translations: {
			page: translations[lang],
		},
		meta: metaTranslations[lang],
	};
};
