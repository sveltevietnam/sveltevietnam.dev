import * as m from '@sveltevietnam/i18n/generated/messages';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-blog-latest.en.jpg?url';
import ogImageVi from './_page/og-blog-latest.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	return {
		routing: {
			breadcrumbs: b['/:lang/blog/latest']({ lang }),
			paths: {
				vi: p['/:lang/blog/latest']({ lang: 'vi' }),
				en: p['/:lang/blog/latest']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.blog_latest.title'](lang),
			description: m['pages.blog_latest.desc'](lang),
			keywords: m['pages.blog_latest.keywords'](lang),
			og: {
				image: {
					src: ogImage[lang],
				},
			},
		},
	};
};
