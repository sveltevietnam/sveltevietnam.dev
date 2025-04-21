import { loadBlogSeries, ids } from '$data/blog/series';
import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-blog-series.en.jpg?url';
import ogImageVi from './_page/og-blog-series.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	const series = (
		await Promise.all(ids.map((id) => loadBlogSeries(id, lang, { thumbnail: true })))
	).filter(Boolean);

	return {
		series,
		routing: {
			breadcrumbs: b['/:lang/blog/series']({ lang }),
			paths: {
				vi: p['/:lang/blog/series']({ lang: 'vi' }),
				en: p['/:lang/blog/series']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.blog_series.title'](lang),
			description: m['pages.blog_series.desc'](lang),
			keywords: m['pages.blog_series.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
