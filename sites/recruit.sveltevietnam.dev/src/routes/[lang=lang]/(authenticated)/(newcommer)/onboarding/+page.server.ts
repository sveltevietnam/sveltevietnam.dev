import { error, fail, redirect } from '@sveltejs/kit';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles } from 'sveltekit-superforms/server';

import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { uploadEmployerImage } from '$lib/data/employers';
import { createEmployerProfileSchema } from '$lib/forms/employer-profile';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { lang } = params;
	if (locals.user?.onboardedAt) redirect(302, p['/:lang/welcome']({ lang: locals.language }));
	const schema = createEmployerProfileSchema(lang);
	return {
		form: await superValidate(valibot(schema)),
		routing: {
			breadcrumbs: b['/:lang/onboarding']({ lang }),
			paths: {
				vi: p['/:lang/onboarding']({ lang: 'vi' }),
				en: p['/:lang/onboarding']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.onboarding.meta.title'](lang).toString(),
		},
	};
};

export const actions: Actions = {
	onboard: async (event) => {
		const { request, locals, platform } = event;
		const { language } = locals;

		if (!locals.user) redirect(302, p['/:lang/authenticate']({ lang: language }));

		const r2 = platform?.env?.r2;
		if (!r2) {
			error(500, { code: 'SV001', message: 'R2 not available' });
		}

		const schema = createEmployerProfileSchema(language);
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		const { image, ...update } = form.data;
		const id = locals.user.id;

		const { status } = await locals.auth.api.updateUser({
			body: {
				...update,
				image: image ? await uploadEmployerImage(id, image) : undefined,
				onboardedAt: new Date(),
			},
			headers: request.headers,
			request,
		});
		if (!status) {
			// TODO: error logging
			error(500, { code: 'SV001', message: 'Error from backend' });
		}

		redirect(302, p['/:lang/welcome']({ lang: language }));
	},
};
