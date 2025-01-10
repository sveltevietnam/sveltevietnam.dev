import { error } from '@sveltejs/kit';

import { loadBlogCategory, loadBlogCategoryBySlug } from '$data/blog/categories';
import { loadBlogPostsByCategory } from '$data/blog/posts';
import { LOAD_DEPENDENCIES } from '$lib/constants';
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
		loadBlogPostsByCategory(category.id, lang, pagination.current, pagination.per),
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
			title: `${category.name} | Svelte Vietnam`,
			description: category.description,
		},
	};
};
