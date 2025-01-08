import { error } from '@sveltejs/kit';

import { loadBlogCategoryBySlug } from '$data/blog/categories';
import { loadBlogPostsByCategory } from '$data/blog/posts';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildRoutes } from '$lib/routing/utils';
import { getPaginationFromUrl } from '$lib/utils/url';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url, locals, depends, params }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const category = await loadBlogCategoryBySlug(params.category, locals.sharedSettings.language);
	if (!category) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Category not found', code: 'SV000' });
	}

	const pagination = getPaginationFromUrl(url);
	const [{ posts, total }, parentLoadData] = await Promise.all([
		loadBlogPostsByCategory(
			category.id,
			locals.sharedSettings.language,
			pagination.current,
			pagination.per,
		),
		parent(),
	]);

	const routeParam = {
		name: category.name,
		path: category.slug,
	};

	return {
		category,
		posts,
		routing: {
			...parentLoadData.routing,
			breadcrumbs: buildRoutes(parentLoadData.routing.breadcrumbs, routeParam),
			paths: {
				en: buildRoutes(parentLoadData.routing.paths.en, routeParam),
				vi: buildRoutes(parentLoadData.routing.paths.vi, routeParam),
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
