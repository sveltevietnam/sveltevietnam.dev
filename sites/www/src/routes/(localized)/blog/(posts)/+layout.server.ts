import { error } from '@sveltejs/kit';

import { LOAD_DEPENDENCIES } from '$lib/constants';
import {
	EXTERNAL_POSTS,
	INTERNAL_POSTS,
	findPostBySlug,
	isSamePost,
	localizeExternalPost,
	localizePost,
	searchPostsInSameSeries,
} from '$lib/data/blog';

import type { LayoutServerLoad } from './$types';
import { translations } from './translation';

export const load: LayoutServerLoad = async ({ url, depends, locals }) => {
	const lang = locals.settings.language;
	const slug = url.pathname.split('/').at(-1);
	const post = findPostBySlug(INTERNAL_POSTS, slug);
	if (!post) error(404, 'No such post');

	const latestInternal = INTERNAL_POSTS.find((p) => !isSamePost(lang, p, post));
	const inSeries = searchPostsInSameSeries(lang, INTERNAL_POSTS, post);

	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		latest: {
			internal: !latestInternal ? [] : [latestInternal].map((p) => localizePost(lang, p)),
			external: EXTERNAL_POSTS.slice(0, 1).map((p) => localizeExternalPost(lang, p)),
		},
		inSeries: inSeries.map((posts) => posts.map((p) => localizePost(lang, p))),
		translations: {
			layout: translations[lang],
		},
	};
};
