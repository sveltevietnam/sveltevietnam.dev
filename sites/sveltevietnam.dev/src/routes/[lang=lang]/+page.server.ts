import { loadBlogPost, ids } from '$data/blog/posts';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildStructuredOrganization } from '$lib/meta/structured/organization';

import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;
	return {
		posts: (await Promise.all(ids.slice(0, 3).map((id) => loadBlogPost(id, lang)))).filter(Boolean),
		meta: {
			structured: buildStructuredOrganization(lang),
		},
	};
};
