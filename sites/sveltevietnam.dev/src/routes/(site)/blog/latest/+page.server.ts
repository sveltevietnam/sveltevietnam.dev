import { loadBlogPosts } from '$data/blog/posts';
import * as m from '$data/locales/generated/messages';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { getPaginationFromUrl } from '$lib/utils/url';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-blog-latest.en.jpg?url';
import ogImageVi from './_page/og-blog-latest.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ url, locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;
	const pagination = getPaginationFromUrl(url);
	const { posts, total } = await loadBlogPosts(lang, pagination.current, pagination.per);
	return {
		posts,
		pagination: {
			...pagination,
			max: Math.ceil(total / pagination.per),
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
