import { loadBlogPost, ids } from '$data/blog/posts';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		posts: (
			await Promise.all(
				ids.slice(0, 3).map((id) => loadBlogPost(id, locals.sharedSettings.language)),
			)
		).filter(Boolean),
	};
};
