import { error } from '@sveltejs/kit';

import { loadBlogCategory, loadBlogCategoryBySlug } from '$data/blog/categories';
import { searchBlogPosts } from '$data/blog/posts';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildStructuredBlogCategoryPage } from '$lib/meta/structured/blog';
import { buildRoutes } from '$lib/routing/utils';
import { getPaginationFromUrl } from '$lib/utils/url';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url, locals, depends, params }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const lang = locals.sharedSettings.language;
	const category = await loadBlogCategoryBySlug(params.category, lang);
	if (!category) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Category not found', code: 'SV000' });
	}

	const otherLang = lang === 'en' ? 'vi' : 'en';
	const pagination = getPaginationFromUrl(url);
	const [{ posts, total }, otherLangCategory, { routing }] = await Promise.all([
		searchBlogPosts({
			lang,
			where: {
				categoryId: category.id,
			},
			pagination: {
				page: pagination.current,
				per: pagination.per,
			},
		}),
		loadBlogCategory(category.id, otherLang),
		parent(),
	]);

	const routeParam = {
		name: category.name,
		path: category.slug,
	};
	const otherLangRouteParam = otherLangCategory
		? {
				name: otherLangCategory.name,
				path: otherLangCategory.slug,
			}
		: routeParam;

	return {
		category,
		posts,
		routing: {
			...routing,
			breadcrumbs: buildRoutes(routing.breadcrumbs, routeParam),
			paths: {
				[lang]: buildRoutes(routing.paths[lang], routeParam),
				[otherLang]: buildRoutes(routing.paths[otherLang], otherLangRouteParam),
			},
		},
		pagination: {
			...pagination,
			max: Math.ceil(total / pagination.per),
		},
		meta: {
			structured: buildStructuredBlogCategoryPage(lang, VITE_PUBLIC_ORIGIN, category),
			title: `${category.name} | Svelte Vietnam`,
			description: category.description,
		},
	};
};
