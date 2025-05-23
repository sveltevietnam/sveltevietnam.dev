import { loadBlogPost, ids } from '$data/blog/posts';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { buildStructuredOrganization } from '$lib/meta/structured/organization';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	return {
		routing: {
			breadcrumbs: b['/:lang']({ lang }),
			paths: {
				vi: p['/:lang']({ lang: 'vi' }),
				en: p['/:lang']({ lang: 'en' }),
			},
		},
		posts: (await Promise.all(ids.slice(0, 3).map((id) => loadBlogPost(id, lang)))).filter(Boolean),
		meta: {
			structured: buildStructuredOrganization(lang, VITE_PUBLIC_ORIGIN),
		},
	};
};
