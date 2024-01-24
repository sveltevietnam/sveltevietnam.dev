import ogImageEn from '$lib/assets/images/og/og-roadmap.en.jpg';
import ogImageVi from '$lib/assets/images/og/og-roadmap.vi.jpg';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';
import { translations as pageT } from './_page/translation';

const metaTranslations: Record<App.Language, App.PageData['meta']> = {
	vi: {
		title: 'Lộ trình | Svelte Việt Nam',
		description: 'Kế hoạch phát triển trang web sveltevietnam.dev',
		keywords: ['mốc', 'lộ trình', 'kế hoạch'],
		og: {
			image: ogImageVi,
		},
	},
	en: {
		title: 'Roadmap | Svelte Vietnam',
		description: 'Development plan for sveltevietnam.dev site',
		keywords: ['milestone', 'roadmap', 'plan', 'release'],
		og: {
			image: ogImageEn,
		},
	},
};

export const load: PageServerLoad = async ({ depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(lang, 'roadmap'),
		translations: {
			page: pageT[lang],
		},
		events: {
			upcoming: [],
			past: [],
		},
		meta: metaTranslations[lang],
	};
};
