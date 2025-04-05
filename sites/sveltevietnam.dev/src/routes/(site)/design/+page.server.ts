import { loadBlogSeries, ids } from '$data/blog/series';
import * as m from '$data/locales/generated/messages';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-design.en.jpg?url';
import ogImageVi from './_page/og-design.vi.jpg?url';

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
			title: m['pages.design.title'](lang),
			description: m['pages.design.desc'](lang),
			keywords: m['pages.design.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
