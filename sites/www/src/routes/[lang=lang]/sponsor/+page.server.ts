import ogImageEn from '$shared/assets/images/og/og-sponsor.en.jpg';
import ogImageVi from '$shared/assets/images/og/og-sponsor.vi.jpg';
import { LOAD_DEPENDENCIES } from '$shared/constants';
import type { Language } from '$shared/services/i18n';
import { ROOT_URL, SPONSOR_PATH } from '$shared/services/navigation';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations: Record<Language, App.PageData['meta']> = {
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
	const tMeta = metaTranslations[language];
	return {
		breadcrumbs: buildBreadcrumbs(url.pathname),
		translations: {
			page: translations[language],
		},
		meta: {
			...tMeta,
			canonical: `${ROOT_URL}/${language}${SPONSOR_PATH}`,
		},
	};
};
