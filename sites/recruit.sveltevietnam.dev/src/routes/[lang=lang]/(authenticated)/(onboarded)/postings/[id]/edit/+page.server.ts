import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { getBackend } from '$lib/backend/utils';
import { createJobPostingUpsertSchema } from '$lib/forms/job-posting-upsert';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { lang, id } = params;
	const parentData = await parent();

	if (parentData.expired) {
		// prevent edit if the posting is expired
		redirect(302, p['/:lang/postings/:id']({ lang, id }));
	}

	const schema = createJobPostingUpsertSchema(lang);
	return {
		...parentData,
		form: await superValidate(parentData.posting, valibot(schema)),
		routing: {
			breadcrumbs: b['/:lang/postings/:id/edit']({ lang, id: [id, parentData.posting.title] }),
			paths: {
				vi: p['/:lang/postings/:id/edit']({ lang: 'vi', id }),
				en: p['/:lang/postings/:id/edit']({ lang: 'en', id }),
			},
		},
	};
};

export const actions = {
	edit: async (event) => {
		const { request, locals, params } = event;
		const { language } = locals;

		const jobPostings = getBackend().jobPostings();

		const schema = createJobPostingUpsertSchema(language);
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const result = await jobPostings.updateById(params.id, {
			...form.data,
		});

		if (!result.success) {
			// TODO: Error logging
			error(500, { code: 'SV001', message: 'Unknown sever error' });
		}

		redirect(
			302,
			p['/:lang/postings/:id']({
				lang: params.lang,
				id: params.id,
			}),
		);
	},
};
