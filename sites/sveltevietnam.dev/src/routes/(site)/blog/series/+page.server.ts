import { loadBlogSeries, ids } from '$data/blog/series';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	return {
		series: (
			await Promise.all(ids.map((id) => loadBlogSeries(id, locals.sharedSettings.language)))
		).filter(Boolean),
	};
};
