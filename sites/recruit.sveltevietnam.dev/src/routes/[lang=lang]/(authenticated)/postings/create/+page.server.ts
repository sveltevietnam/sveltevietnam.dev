import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { createJobPostingUpsertSchema } from '$lib/forms/job-posting-upsert';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	const schema = createJobPostingUpsertSchema(lang);
	return {
		// TODO: get this form DB of current user
		employer: {
			name: 'Company ABC XYZ',
			avatarUrl: undefined,
			website: 'https://sveltevietnam.dev',
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

		const schema = createJobPostingUpsertSchema(language);
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		return { form };
	},
};
