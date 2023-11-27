import { LOAD_DEPENDENCIES } from '$shared/constants';
import {
	EXTERNAL_POSTS,
	INTERNAL_POSTS,
	localizeExternalPost,
	localizePost,
} from '$shared/data/blog';
import { buildBreadcrumbs } from '$shared/services/navigation/server';

import type { LayoutServerLoad } from './$types';
import { translations } from './translation';

export const load: LayoutServerLoad = async ({ url, depends, locals: { language } }) => {
	let morePosts = INTERNAL_POSTS;
	const slug = url.pathname.split('/').at(-1);
	if (slug) {
		morePosts = morePosts.filter((p) => p.slug !== slug);
	}

	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		breadcrumbs: buildBreadcrumbs(url.pathname),
		more: {
			internal: morePosts.slice(0, 1).map((post) => localizePost(language, post)),
			external: EXTERNAL_POSTS.slice(0, 1).map((post) => localizeExternalPost(language, post)),
		},
		translations: {
			layout: translations[language],
		},
	};
};
