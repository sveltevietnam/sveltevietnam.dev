import { error } from '@sveltejs/kit';

import { LOAD_DEPENDENCIES } from '$shared/constants';
import {
	EXTERNAL_POSTS,
	INTERNAL_POSTS,
	localizeExternalPost,
	localizePost,
	searchPostsInSameSeries,
} from '$shared/data/blog';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { LayoutServerLoad } from './$types';
import { translations } from './translation';

export const load: LayoutServerLoad = async ({ url, depends, locals: { language } }) => {
	const slug = url.pathname.split('/').at(-1);
	const post = INTERNAL_POSTS.find((p) => p.slug === slug);
	if (!post) error(404, 'No such post');

	const otherPosts = INTERNAL_POSTS.filter((p) => p.slug !== post.slug);
	const latestInternal = otherPosts.at(0);
	const inSeries = searchPostsInSameSeries(INTERNAL_POSTS, post);

	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		breadcrumbs: buildBreadcrumbs(url.pathname),
		latest: {
			internal: !latestInternal ? [] : [latestInternal].map((p) => localizePost(language, p)),
			external: EXTERNAL_POSTS.slice(0, 1).map((p) => localizeExternalPost(language, p)),
		},
		inSeries: inSeries.map((posts) => posts.map((p) => localizePost(language, p))),
		translations: {
			layout: translations[language],
		},
	};
};
