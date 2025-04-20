import { error } from '@sveltejs/kit';

import { loadBlogCategory, loadBlogCategoryBySlug } from '$data/blog/categories';
import { searchBlogPosts } from '$data/blog/posts';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { buildStructuredBlogCategoryPage } from '$lib/meta/structured/blog';
import { getPaginationFromUrl } from '$lib/utils/url';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, params }) => {
	const { lang } = params;
	const category = await loadBlogCategoryBySlug(params.slug, lang);
	if (!category) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Category not found', code: 'SV000' });
	}

	const otherLang = lang === 'en' ? 'vi' : 'en';
	const pagination = getPaginationFromUrl(url);
	const [{ posts, total }, otherLangMetadata] = await Promise.all([
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
	]);

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
	} as Record<App.Language, string>;

	return {
		category,
		posts,
		routing: { breadcrumbs, paths },
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
