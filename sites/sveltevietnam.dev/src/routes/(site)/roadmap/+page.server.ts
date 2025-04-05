import { loadBlogSeries, ids } from '$data/blog/series';
import * as m from '$data/locales/generated/messages';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-roadmap.en.jpg?url';
import ogImageVi from './_page/og-roadmap.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;

	return {
		series: (await Promise.all(ids.map((id) => loadBlogSeries(id, lang)))).filter(Boolean),
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
