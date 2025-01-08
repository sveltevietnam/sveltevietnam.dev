import { error } from '@sveltejs/kit';

import { loadBlogPostsBySeries } from '$data/blog/posts';
import { loadBlogSeriesBySlug } from '$data/blog/series';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildRoutes } from '$lib/routing/utils';
import { getPaginationFromUrl } from '$lib/utils/url';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url, locals, depends, params }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const series = await loadBlogSeriesBySlug(params.series, locals.sharedSettings.language);
	if (!series) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Series not found', code: 'SV000' });
	}

	const pagination = getPaginationFromUrl(url);
	const [{ posts, total }, parentLoadData] = await Promise.all([
		loadBlogPostsBySeries(
			series.id,
			locals.sharedSettings.language,
			pagination.current,
			pagination.per,
		),
		parent(),
	]);

	const routeParam = {
		name: series.name,
		path: series.slug,
	};

	return {
		series,
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
			title: `${series.name} | Svelte Vietnam`,
			description: series.description,
		},
	};
};
