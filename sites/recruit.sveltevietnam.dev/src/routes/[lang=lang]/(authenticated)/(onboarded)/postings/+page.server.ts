import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { getBackend } from '$lib/backend/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { lang } = params;
	const user = locals.user!;
	const postings = await getBackend().jobPostings().getByEmployerId(user.id);
	return {
		postings: postings.map((posting) => ({
			...posting,
			postedAt: posting.createdAt,
			href: p['/:lang/postings/:id']({ lang, id: posting.id }),
			employer: {
				name: user.name,
				image: user.image,
				website: user.website,
			},
		})),
		routing: {
			breadcrumbs: b['/:lang/postings']({ lang }),
			paths: {
				vi: p['/:lang/postings']({ lang: 'vi' }),
				en: p['/:lang/postings']({ lang: 'en' }),
			},
		},
	};
};
