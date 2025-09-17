import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { getBackend } from '$lib/backend/utils';
import { createJobPostingUpsertSchema } from '$lib/forms/job-posting-upsert';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { lang } = params;
	const schema = createJobPostingUpsertSchema(lang);
	const employer = locals.user!;
	return {
		employer: {
			name: employer.name,
			image: employer.image,
			website: employer.website,
		},
		form: await superValidate(valibot(schema)),
		routing: {
			breadcrumbs: b['/:lang/postings/create']({ lang }),
			paths: {
				vi: p['/:lang/postings/create']({ lang: 'vi' }),
				en: p['/:lang/postings/create']({ lang: 'en' }),
			},
		},
	};
};

export const actions = {
	create: async (event) => {
		const { request, locals } = event;
		const { language } = locals;

		const jobPostings = getBackend().jobPostings();

		const employerId = locals.user?.id;
		if (!employerId) redirect(302, p['/:lang/authenticate']({ lang: language }));

		const schema = createJobPostingUpsertSchema(language);
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const result = await jobPostings.insert({
			...form.data,
			employerId,
		});

		if (!result.success) {
			// TODO: Error logging
			error(500, { code: 'SV001', message: 'Unknown sever error' });
		}

		// TODO: queue emails to employer and to admin

		redirect(302, p['/:lang/postings/:id']({ lang: language, id: result.id }));
	},
};
