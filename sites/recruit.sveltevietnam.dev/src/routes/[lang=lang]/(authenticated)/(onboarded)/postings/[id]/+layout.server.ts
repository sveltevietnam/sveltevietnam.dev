import { error } from '@sveltejs/kit';

import * as p from '$data/routes/generated';
import { getBackend } from '$lib/backend/utils';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, depends }) => {
	depends('job-posting-edit');

	const { lang, id } = params;

	const posting = await getBackend().jobPostings().getById(id);
	if (!posting) {
		// TODO: Error logging
		error(404, { code: 'SV001', message: 'Job posting not found' });
	}

	return {
		posting: {
			...posting,
			postedAt: posting.createdAt,
			href: p['/:lang/postings/:id']({ lang, id }),
		},
	};
};
