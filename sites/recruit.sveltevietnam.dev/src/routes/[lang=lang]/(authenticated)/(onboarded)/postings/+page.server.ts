import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { getBackend } from '$lib/backend/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { lang } = params;
	const user = locals.user!;
	const postings = (await getBackend().jobPostings().getByEmployerId(user.id)).map((posting) => ({
		...posting,
		href: p['/:lang/postings/:id']({ lang, id: posting.id }),
		employer: {
			name: user.name,
			image: user.image,
			website: user.website,
		},
	}));
	const expired: typeof postings = [];
	const active: typeof postings = [];
	for (const posting of postings) {
		if (posting.expiredAt < new Date()) {
			expired.push(posting);
		} else {
			active.push(posting);
		}
	}
	return {
		active,
		expired,
		routing: {
			breadcrumbs: b['/:lang/postings']({ lang }),
			paths: {
				vi: p['/:lang/postings']({ lang: 'vi' }),
				en: p['/:lang/postings']({ lang: 'en' }),
			},
		},
	};
};
