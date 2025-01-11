import { error } from '@sveltejs/kit';

import {
	loadBlogPostBySlug,
	loadBlogPostMetadata,
	ids,
	loadBlogPost,
	search,
} from '$data/blog/posts';
import { loadPersonAvatar } from '$data/people';
import { SVELTE_VIETNAM_BLOG } from '$data/structured';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildRoutes } from '$lib/routing/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params, locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const lang = locals.sharedSettings.language;
	const post = await loadBlogPostBySlug(params.slug, lang);
	if (!post) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Category not found', code: 'SV000' });
	}

	const latestPostId = ids[0] === post.id ? ids[1] : ids[0];
	const otherLang = lang === 'en' ? 'vi' : 'en';
	const [latestPost, inSeries, otherLangMetadata, { routing }] = await Promise.all([
		loadBlogPost(latestPostId, lang),
		post.series.length
			? search({
					lang,
					where: {
						seriesId: post.series[0].id,
					},
					excludedIds: [post.id],
					pagination: { per: 3, page: 1 },
				})
			: null,
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
			latest: latestPost,
			inSeries: inSeries?.posts.filter((p) => p.id !== post.id).slice(0, 3),
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
			structured: SVELTE_VIETNAM_BLOG,
			title: `${post.title}`,
			description: post.description,
		},
	};
};
