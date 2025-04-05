import { loadBlogCategory, ids } from '$data/blog/categories';
import * as m from '$data/locales/generated/messages';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;

	return {
		categories: (await Promise.all(ids.map((id) => loadBlogCategory(id, lang)))).filter(Boolean),
		meta: {
			title: m['pages.blog_categories.title'](lang),
			description: m['pages.blog_categories.desc'](lang),
			keywords: m['pages.blog_categories.keywords'](lang),
		},
	};
};
