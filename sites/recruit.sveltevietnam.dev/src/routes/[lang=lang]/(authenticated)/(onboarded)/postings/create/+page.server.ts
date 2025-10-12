import { error, fail, redirect } from '@sveltejs/kit';
import { JOB_POSTING_TYPE_I18N } from '@sveltevietnam/backend/data/job-postings/enums';
import { formatTimeDiff } from '@sveltevietnam/kit/utilities/datetime';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PRIVATE_ADMIN_EMAIL } from '$env/static/private';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
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

		const result = await backend.jobPostings().insert({
			...form.data,
			applicationMethod: form.data.application.method,
			applicationLink: form.data.application.link,
			employerId: employer.id,
		});

		if (!result.success) {
			// TODO: Error logging
			error(500, { code: 'SV001', message: 'Unknown sever error' });
		}

		const jobPath = p['/:lang/postings/:id']({ lang, id: result.id });

		await Promise.all([
			backend.mails().queue('recruit-employer-create-job-posting', {
				actorId: employer.id,
				lang,
				vars: {
					name: employer.name,
					jobTitle: form.data.title,
					jobUrl: VITE_PUBLIC_ORIGIN + jobPath,
				},
			}),
			backend.mails().queue('recruit-admin-job-posting-pending-approval', {
				email: VITE_PRIVATE_ADMIN_EMAIL,
				lang,
				vars: {
					posting: {
						title: form.data.title,
						type: JOB_POSTING_TYPE_I18N[form.data.type][lang],
						location: form.data.location,
						salary: form.data.salary,
						expiration: `${form.data.expiredAt.toLocaleString('en', { timeZone: 'Asia/Ho_Chi_Minh' })} (${formatTimeDiff(form.data.expiredAt, new Date())})`,
						application: form.data.application.link,
						description: form.data.description,
					},
					employer: {
						name: employer.name,
						email: employer.email,
						website: employer.website,
						image: employer.image ? VITE_PUBLIC_ORIGIN + employer.image : null,
						description: employer.description,
					},
				},
			}),
		]);

		redirect(302, jobPath);
	},
};
