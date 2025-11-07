import type { Language } from '@sveltevietnam/kit/constants';

import { getBlogCategoryBySlug } from '$data/blog/categories';
import { loadBlogCategory } from '$data/blog/categories/entries';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { buildStructuredBlogCategoryPage } from '$lib/meta/structured/blog';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { lang, slug } = params;
	const category = await getBlogCategoryBySlug({ slug, optionalModules: { ogImage: true } });

	const otherLang = lang === 'en' ? 'vi' : 'en';
	const [otherLangMetadata] = await Promise.all([loadBlogCategory(category.id, otherLang)]);

	const breadcrumbs = b['/:lang/blog/categories/:slug']({
		lang,
		slug: [category.slug, category.name],
	});
	const paths = {
		[lang]: p['/:lang/blog/categories/:slug']({ lang, slug: category.slug }),
		[otherLang]: p['/:lang/blog/categories/:slug']({
			lang: otherLang,
			slug: otherLangMetadata?.slug ?? category.slug,
		}),
	} as Record<Language, string>;

	return {
		category,
		routing: { breadcrumbs, paths },
		meta: {
			og: {
				image: {
					src: category.ogImage,
				},
			},
			structured: buildStructuredBlogCategoryPage(lang, VITE_PUBLIC_ORIGIN, category),
			title: `${category.name} | Svelte Vietnam`,
			description: category.description,
		},
	};
};
