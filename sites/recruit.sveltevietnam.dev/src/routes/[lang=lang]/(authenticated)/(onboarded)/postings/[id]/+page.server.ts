import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import * as v from 'valibot';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { getBackend } from '$lib/backend/utils';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { lang, id } = params;

	const jobPostings = getBackend().jobPostings();

	const posting = await jobPostings.getById(id);
	if (!posting) {
		// TODO: Error logging
		error(404, { code: 'SV001', message: 'Job posting not found' });
	}

	const deleteSchema = v.object({
		id: v.pipe(v.string(), v.nonEmpty()),
	});
	return {
		posting: {
			...posting,
			postedAt: posting.createdAt,
			href: p['/:lang/postings/:id']({ lang, id }),
		},
		deleteForm: await superValidate({ id: posting.id }, valibot(deleteSchema)),
		routing: {
			breadcrumbs: b['/:lang/postings/:id']({ lang, id: [id, posting.title] }),
			paths: {
				vi: p['/:lang/postings/:id']({ lang: 'vi', id }),
				en: p['/:lang/postings/:id']({ lang: 'en', id }),
			},
		},
	};
};

export const actions: Actions = {
	delete: async () => {
		// TODO: implement this
	},
};
