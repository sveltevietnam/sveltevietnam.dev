import type { Language } from '@sveltevietnam/kit/constants';

import { getBlogSeriesBySlug } from '$data/blog/series';
import { loadBlogSeries } from '$data/blog/series/entries';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { buildStructuredBlogSeries } from '$lib/meta/structured/blog';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { lang, slug } = params;
	const series = await getBlogSeriesBySlug({ slug, optionalModules: { ogImage: true } });

	const otherLang = lang === 'en' ? 'vi' : 'en';
	const [otherLangMetadata] = await Promise.all([loadBlogSeries(series.id, otherLang)]);

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
	} as Record<Language, string>;

	return {
		series,
		routing: { breadcrumbs, paths },
		meta: {
			og: {
				image: {
					src: series.ogImage,
				},
			},
			structured: buildStructuredBlogSeries(lang, VITE_PUBLIC_ORIGIN, series),
			title: `${series.name} | Svelte Vietnam`,
			description: series.description,
		},
	};
};
