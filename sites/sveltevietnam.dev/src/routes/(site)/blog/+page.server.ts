import { loadBlogCategory } from '$data/blog/categories';
import { loadBlogPostsByCategory, loadBlogPosts } from '$data/blog/posts';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const [catSvelteAndKit, catInsider] = await Promise.all([
		loadBlogCategory('svelte-and-kit', locals.sharedSettings.language),
		loadBlogCategory('insider', locals.sharedSettings.language),
	]);

	const { posts: latest } = await loadBlogPosts(locals.sharedSettings.language, 1, 4);
	const [svelteAndKit, insider] = await Promise.all([
		loadBlogPostsByCategory('svelte-and-kit', locals.sharedSettings.language, 1, 3, latest.map((post) => post.id)),
		loadBlogPostsByCategory('insider', locals.sharedSettings.language, 1, 3, latest.map((post) => post.id)),
	]);

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
	};
};
