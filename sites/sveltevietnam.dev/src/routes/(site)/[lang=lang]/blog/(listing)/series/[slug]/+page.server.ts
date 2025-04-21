import { error } from '@sveltejs/kit';

import { searchBlogPosts } from '$data/blog/posts';
import { loadBlogSeriesBySlug, loadBlogSeries } from '$data/blog/series';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { buildStructuredBlogSeries } from '$lib/meta/structured/blog';
import { getPaginationFromUrl } from '$lib/utils/url';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, params }) => {
	const { lang } = params;
	const series = await loadBlogSeriesBySlug(params.slug, lang, { ogImage: true });
	if (!series) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Series not found', code: 'SV000' });
	}

	const otherLang = lang === 'en' ? 'vi' : 'en';
	const pagination = getPaginationFromUrl(url);
	const [{ posts, total }, otherLangMetadata] = await Promise.all([
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
	]);

	const breadcrumbs = b['/:lang/blog/series/:slug']({
		lang,
		slug: [series.slug, series.name],
	});
	const paths = {
		[lang]: p['/:lang/blog/series/:slug']({ lang, slug: series.slug }),
		[otherLang]: p['/:lang/blog/series/:slug']({
			lang: otherLang,
			slug: otherLangMetadata?.slug ?? series.slug,
		}),
	} as Record<App.Language, string>;

	return {
		series,
		posts,
		routing: { breadcrumbs, paths },
		pagination: {
			...pagination,
			max: Math.ceil(total / pagination.per),
		},
		meta: {
			og: {
				image: series.ogImage,
			},
			structured: buildStructuredBlogSeries(lang, VITE_PUBLIC_ORIGIN, series),
			title: `${series.name} | Svelte Vietnam`,
			description: series.description,
		},
	};
};
