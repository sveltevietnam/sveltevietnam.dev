import { loadBlogCategory } from '$data/blog/categories';
import { search, loadBlogPosts } from '$data/blog/posts';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildStructuredBlog } from '$lib/meta/structured/blog';

import type { PageServerLoad } from './$types';

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
			search({
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
			structured: buildStructuredBlog(lang),
		},
	};
};
