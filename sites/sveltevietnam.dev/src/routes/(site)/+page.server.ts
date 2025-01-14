import { loadBlogPost, ids } from '$data/blog/posts';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildStructuredOrganization } from '$lib/meta/structured/organization';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends, parent }) => {
	const { meta } = await parent()
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;
	return {
		posts: (
			await Promise.all(
				ids.slice(0, 3).map((id) => loadBlogPost(id, lang)),
			)
		).filter(Boolean),
		meta: {
			...meta,
			structured: buildStructuredOrganization(lang)
		},
	};
};
