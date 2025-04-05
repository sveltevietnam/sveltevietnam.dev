import { loadBlogSeries, ids } from '$data/blog/series';
import * as m from '$data/locales/generated/messages';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-sponsor.en.jpg?url';
import ogImageVi from './_page/og-sponsor.vi.jpg?url';

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
			title: m['pages.sponsor.title'](lang),
			description: m['pages.sponsor.desc'](lang),
			keywords: m['pages.sponsor.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
