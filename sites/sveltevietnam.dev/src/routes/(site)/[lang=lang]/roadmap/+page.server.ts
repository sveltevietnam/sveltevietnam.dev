import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-roadmap.en.jpg?url';
import ogImageVi from './_page/og-roadmap.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;

	return {
		routing: {
			breadcrumbs: b['/:lang/roadmap']({ lang }),
			paths: {
				vi: p['/:lang/roadmap']({ lang: 'vi' }),
				en: p['/:lang/roadmap']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.roadmap.title'](lang),
			description: m['pages.roadmap.desc'](lang),
			keywords: m['pages.roadmap.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
