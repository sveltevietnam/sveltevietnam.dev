import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import * as m from '$data/locales/generated/messages';
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
		meta: {
			title: m['pages.postings_upsert.meta.title.create'](lang).toString(),
		},
	};
};

export const actions = {
	create: async (event) => {
		const { request, locals, params } = event;
		const { lang } = params;

		const backend = getBackend();

		const employer = locals.user;
		if (!employer) redirect(302, p['/:lang/authenticate']({ lang }));

		const schema = createJobPostingUpsertSchema(lang);
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const placeholderPath = p['/:lang/postings/:id']({ lang, id: 'placeholder' });
		const result = await backend.jobPostings().create({
			posting: {
				...form.data,
				applicationMethod: form.data.application.method,
				applicationLink: form.data.application.link,
				employerId: employer.id,
			},
			lang,
			placeholderPath,
		});

		if (!result.success) {
			// TODO: Error logging
			error(500, { code: 'SV001', message: 'Unknown sever error' });
		}

		redirect(302, placeholderPath.replace('placeholder', result.id));
	},
};
