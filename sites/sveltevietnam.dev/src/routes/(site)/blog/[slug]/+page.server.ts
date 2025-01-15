import { error } from '@sveltejs/kit';

import {
	loadBlogPostBySlug,
	loadBlogPostMetadata,
	ids,
	loadBlogPost,
	searchPostsInSameSeries,
} from '$data/blog/posts';
import { loadPersonAvatar } from '$data/people';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildStructuredBlogPost } from '$lib/meta/structured/blog';
import { buildRoutes } from '$lib/routing/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, parent, params, locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const lang = locals.sharedSettings.language;
	const post = await loadBlogPostBySlug(params.slug, lang);
	if (!post) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Post not found', code: 'SV000' });
	}

	const latestPostId = ids[0] === post.id ? ids[1] : ids[0];
	const otherLang = lang === 'en' ? 'vi' : 'en';
	const [latest, inSeries, otherLangMetadata, { routing }] = await Promise.all([
		loadBlogPost(latestPostId, lang),
		searchPostsInSameSeries(
			lang,
			post.id,
			post.series.map((s) => s.id),
		),
		loadBlogPostMetadata(post.id, otherLang),
		parent(),
		...post.authors.map(async (author) => {
			const avatar = await loadPersonAvatar(author.id);
			author.avatar = avatar;
		}),
	]);

	const routeParam = {
		name: post.title,
		path: post.slug,
	};

	const otherLangRouteParam = otherLangMetadata
		? {
				name: otherLangMetadata.title,
				path: otherLangMetadata.slug,
			}
		: routeParam;

	return {
		contentEditUrl: `https://github.com/sveltevietnam/sveltevietnam.dev/edit/v1/sites/sveltevietnam.dev/src/data/blog/posts/${post.id}/content/${lang}.md.svelte`,
		lang,
		post,
		posts: {
			latest,
			inSeries,
		},
		routing: {
			...routing,
			breadcrumbs: buildRoutes(routing.breadcrumbs, routeParam),
			paths: {
				[lang]: buildRoutes(routing.paths[lang], routeParam),
				[otherLang]: buildRoutes(routing.paths[otherLang], otherLangRouteParam),
			},
		},
		meta: {
			structured: buildStructuredBlogPost(lang, url.origin, post),
			title: `${post.title}`,
			description: post.description,
		},
	};
};
