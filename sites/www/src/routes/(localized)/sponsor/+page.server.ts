import ogImageEn from '$lib/assets/images/og/og-sponsor.en.jpg';
import ogImageVi from '$lib/assets/images/og/og-sponsor.vi.jpg';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations: Record<App.Language, App.PageData['meta']> = {
	vi: {
		title: 'Tài trợ | Svelte Việt Nam',
		description: 'Chung tay phát triển cộng đồng Svelte Việt Nam',
		keywords: ['tài trợ', 'đóng góp'],
		og: {
			image: ogImageVi,
		},
	},
	en: {
		title: 'Sponsor | Svelte Vietnam',
		description: 'Grow together with the Svelte Vietnam community',
		keywords: ['sponsor', 'contribute'],
		og: {
			image: ogImageEn,
		},
	},
};

export const load: PageServerLoad = ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(language, 'sponsor'),
		translations: {
			page: translations[language],
		},
		meta: metaTranslations[language],
	};
};
