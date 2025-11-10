import * as m from '@sveltevietnam/i18n/generated/messages';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { buildStructuredBlog } from '$lib/meta/structured/blog';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-blog.en.jpg?url';
import ogImageVi from './_page/og-blog.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	return {
		routing: {
			breadcrumbs: b['/:lang/blog']({ lang }),
			paths: {
				vi: p['/:lang/blog']({ lang: 'vi' }),
				en: p['/:lang/blog']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.blog.title'](lang),
			description: m['pages.blog.desc'](lang),
			keywords: m['pages.blog.keywords'](lang),
			og: {
				image: {
					src: ogImage[lang],
				},
			},
			structured: buildStructuredBlog(lang, VITE_PUBLIC_ORIGIN),
		},
	};
};
