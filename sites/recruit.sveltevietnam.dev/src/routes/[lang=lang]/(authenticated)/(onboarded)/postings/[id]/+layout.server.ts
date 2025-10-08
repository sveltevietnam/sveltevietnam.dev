import { error } from '@sveltejs/kit';

import * as p from '$data/routes/generated';
import { getBackend } from '$lib/backend/utils';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals, depends }) => {
	depends('job-posting-detail');

	const { lang, id } = params;

	const posting = await getBackend().jobPostings().getById(id, locals.user!.id);
	if (!posting) {
		// TODO: Error logging
		error(404, { code: 'SV001', message: 'Job posting not found' });
	}

	return {
		posting: {
			...posting,
			href: p['/:lang/postings/:id']({ lang, id }),
			postedAt: posting.approvedAt,
		},
		editable: posting.status === 'pending',
	};
};
