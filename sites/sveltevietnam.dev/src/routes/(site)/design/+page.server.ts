import { loadBlogSeries, ids } from '$data/blog/series';
import * as m from '$data/locales/generated/messages';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogViImage from './_page/og.en.jpg?url';
import ogEnImage from './_page/og.vi.jpg?url';

const ogImage = {
	vi: ogViImage,
	en: ogEnImage,
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
