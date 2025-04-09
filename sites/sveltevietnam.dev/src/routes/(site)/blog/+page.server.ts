import { loadBlogCategory } from '$data/blog/categories';
import { searchBlogPosts, loadBlogPosts } from '$data/blog/posts';
import * as m from '$data/locales/generated/messages';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildStructuredBlog } from '$lib/meta/structured/blog';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-blog.en.jpg?url';
import ogImageVi from './_page/og-blog.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const lang = locals.sharedSettings.language;
	const [catSvelteAndKit, catInsider] = await Promise.all([
		loadBlogCategory('svelte-and-kit', lang),
		loadBlogCategory('insider', lang),
	]);

	const { posts: latest } = await loadBlogPosts(lang, 1, 4);
	const [svelteAndKit, insider] = await Promise.all(
		['svelte-and-kit', 'insider'].map((categoryId) =>
			searchBlogPosts({
				lang,
				where: { categoryId },
				pagination: { per: 3, page: 1 },
				excludedIds: latest.map((post) => post.id),
			}),
		),
	);

	return {
		categories: {
			svelteAndKit: catSvelteAndKit,
			insider: catInsider,
		},
		posts: {
			latest,
			svelteAndKit: svelteAndKit.posts,
			insider: insider.posts,
		},
		meta: {
			title: m['pages.blog.title'](lang),
			description: m['pages.blog.desc'](lang),
			keywords: m['pages.blog.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
			structured: buildStructuredBlog(lang),
		},
	};
};
