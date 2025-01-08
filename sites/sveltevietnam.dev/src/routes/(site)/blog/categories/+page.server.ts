import { loadBlogCategory, ids } from '$data/blog/categories';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	return {
		categories: (
			await Promise.all(ids.map((id) => loadBlogCategory(id, locals.sharedSettings.language)))
		).filter(Boolean),
	};
};
