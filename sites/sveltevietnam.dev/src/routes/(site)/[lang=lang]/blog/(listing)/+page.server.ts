import { loadBlogCategory } from '$data/blog/categories';
import { searchBlogPosts, loadBlogPosts } from '$data/blog/posts';
import { loadBlogSeries } from '$data/blog/series';
import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { upsert } from '$lib/forms/subscriber/server';
import { buildStructuredBlog } from '$lib/meta/structured/blog';

import type { Actions, PageServerLoad } from './$types';
import ogImageEn from './_page/og-blog.en.jpg?url';
import ogImageVi from './_page/og-blog.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	const [seriesPeopleOfSvelte, catSvelteAndKit, catInsider] = await Promise.all([
		loadBlogSeries('people-of-svelte', lang),
		loadBlogCategory('svelte-and-kit', lang),
		loadBlogCategory('insider', lang),
	]);

	const { posts: latest } = await loadBlogPosts(lang, 1, 4);
	const [peopleOfSvelte, svelteAndKit, insider] = await Promise.all([
		...['people-of-svelte'].map((seriesId) =>
			searchBlogPosts({
				lang,
				where: { seriesId },
				pagination: { per: 3, page: 1 },
			}),
		),
		...['svelte-and-kit', 'insider'].map((categoryId) =>
			searchBlogPosts({
				lang,
				where: { categoryId },
				pagination: { per: 3, page: 1 },
				excludedIds: latest.map((post) => post.id),
			}),
		),
	]);

	return {
		series: {
			peopleOfSvelte: seriesPeopleOfSvelte,
		},
		categories: {
			svelteAndKit: catSvelteAndKit,
			insider: catInsider,
		},
		posts: {
			latest,
			peopleOfSvelte: peopleOfSvelte.posts,
			svelteAndKit: svelteAndKit.posts,
			insider: insider.posts,
		},
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
				image: ogImage[lang],
			},
			structured: buildStructuredBlog(lang, VITE_PUBLIC_ORIGIN),
		},
	};
};

export const actions: Actions = { subscribe: upsert.action };
