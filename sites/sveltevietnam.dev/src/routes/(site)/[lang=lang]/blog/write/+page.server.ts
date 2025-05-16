import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/images/og-blog-write.en.jpg?url';
import ogImageVi from './_page/images/og-blog-write.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	return {
		routing: {
			breadcrumbs: b['/:lang/blog/write']({ lang }),
			paths: {
				vi: p['/:lang/blog/write']({ lang: 'vi' }),
				en: p['/:lang/blog/write']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.blog_write.title'](lang),
			description: m['pages.blog_write.desc'](lang),
			keywords: m['pages.blog_write.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
