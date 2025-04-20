import { loadBlogSeries, ids } from '$data/blog/series';
import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-blog-series.en.jpg?url';
import ogImageVi from './_page/og-blog-series.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;

	return {
		series: (await Promise.all(ids.map((id) => loadBlogSeries(id, lang)))).filter(Boolean),
		routing: {
			breadcrumbs: b['/:lang/blog/series']({ lang }),
			paths: {
				vi: p['/:lang/blog/series']({ lang: 'vi' }),
				en: p['/:lang/blog/series']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.blog_latest.title'](lang),
			description: m['pages.blog_latest.desc'](lang),
			keywords: m['pages.blog_latest.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
