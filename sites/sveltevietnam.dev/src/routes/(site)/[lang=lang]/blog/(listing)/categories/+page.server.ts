import { loadBlogCategory, ids } from '$data/blog/categories';
import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-blog-categories.en.jpg?url';
import ogImageVi from './_page/og-blog-categories.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;

	return {
		categories: (await Promise.all(ids.map((id) => loadBlogCategory(id, lang)))).filter(Boolean),
		routing: {
			breadcrumbs: b['/:lang/blog/categories']({ lang }),
			paths: {
				vi: p['/:lang/blog/categories']({ lang: 'vi' }),
				en: p['/:lang/blog/categories']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.blog_categories.title'](lang),
			description: m['pages.blog_categories.desc'](lang),
			keywords: m['pages.blog_categories.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
