import { loadBlogPosts } from '$data/blog/posts';
import { loadEvents } from '$data/events';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { buildStructuredOrganization } from '$lib/meta/structured/organization';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;

	const [{ events }, { posts }] = await Promise.all([
		loadEvents({
			lang,
			where: { status: ['ongoing', 'upcoming'] },
		}),
		loadBlogPosts(lang, 1, 3),
	]);
	return {
		routing: {
			breadcrumbs: b['/:lang']({ lang }),
			paths: {
				vi: p['/:lang']({ lang: 'vi' }),
				en: p['/:lang']({ lang: 'en' }),
			},
		},
		events,
		posts,
		meta: {
			structured: buildStructuredOrganization(lang, VITE_PUBLIC_ORIGIN),
		},
	};
};
