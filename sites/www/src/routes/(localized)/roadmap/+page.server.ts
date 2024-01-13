import { prepareRoutePageData } from '$client/contexts/navigation';
import ogImageEn from '$shared/assets/images/og/og-roadmap.en.jpg';
import ogImageVi from '$shared/assets/images/og/og-roadmap.vi.jpg';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import type { Language } from '$shared/services/i18n';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { translations as pageT } from './_page/translation';

const metaTranslations: Record<Language, App.PageData['meta']> = {
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

export const load: PageServerLoad = async ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(language, 'roadmap'),
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: pageT[language],
		},
		events: {
			upcoming: [],
			past: [],
		},
		meta: metaTranslations[language],
	};
};
