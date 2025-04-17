import { error } from '@sveltejs/kit';

import { searchBlogPosts } from '$data/blog/posts';
import { loadBlogSeries, loadBlogSeriesBySlug } from '$data/blog/series';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildStructuredBlogSeries } from '$lib/meta/structured/blog';
import { buildRoutes } from '$lib/routing/utils';
import { getPaginationFromUrl } from '$lib/utils/url';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url, locals, depends, params }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const lang = locals.sharedSettings.language;
	const series = await loadBlogSeriesBySlug(params.slug, lang);
	if (!series) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Series not found', code: 'SV000' });
	}

	const otherLang = lang === 'en' ? 'vi' : 'en';
	const pagination = getPaginationFromUrl(url);
	const [{ posts, total }, otherLangSeries, { routing }] = await Promise.all([
		searchBlogPosts({
			lang,
			where: {
				seriesId: series.id,
			},
			pagination: {
				page: pagination.current,
				per: pagination.per,
			},
		}),
		loadBlogSeries(series.id, otherLang),
		parent(),
	]);

	const routeParam = {
		name: series.name,
		path: series.slug,
	};
	const otherLangRouteParam = otherLangSeries
		? {
				name: otherLangSeries.name,
				path: otherLangSeries.slug,
			}
		: routeParam;

	return {
		series,
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
			structured: buildStructuredBlogSeries(lang, VITE_PUBLIC_ORIGIN, series),
			title: `${series.name} | Svelte Vietnam`,
			description: series.description,
		},
	};
};
