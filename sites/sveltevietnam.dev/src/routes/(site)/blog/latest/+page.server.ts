import { loadBlogPosts } from '$data/blog/posts';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { getPaginationFromUrl } from '$lib/utils/url';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const pagination = getPaginationFromUrl(url);
	const { posts, total } = await loadBlogPosts(
		locals.sharedSettings.language,
		pagination.current,
		pagination.per,
	);
	return {
		posts,
		pagination: {
			...pagination,
			max: Math.ceil(total / pagination.per),
		},
	};
};
