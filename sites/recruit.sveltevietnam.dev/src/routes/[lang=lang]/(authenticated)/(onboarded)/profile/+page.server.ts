import { fail, error, redirect } from '@sveltejs/kit';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles } from 'sveltekit-superforms/server';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { uploadEmployerImage } from '$lib/data/employers';
import {
	createEmployerProfileSchema,
	createEmployerEmailSchema,
} from '$lib/forms/employer-profile';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.user!;
	const { lang } = params;
	return {
		updateEmailForm: await superValidate(
			{
				email: user.email,
			},
			valibot(createEmployerEmailSchema(lang)),
		),
		updateInfoForm: await superValidate(
			{
				name: user.name,
				website: user.website ?? undefined,
				description: user.description,
				agreed: true,
			},
			valibot(createEmployerProfileSchema(lang, false)),
		),
		image: user.image,
		routing: {
			breadcrumbs: b['/:lang/profile']({ lang }),
			paths: {
				vi: p['/:lang/profile']({ lang: 'vi' }),
				en: p['/:lang/profile']({ lang: 'en' }),
			},
		},
	};
};

export const actions: Actions = {
	'update-email': async (event) => {
		const { request, locals } = event;
		const { language } = locals;

		const schema = createEmployerEmailSchema(language);
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		form.data.email = form.data.email.toLowerCase();

		return { form };
	},
	'update-info': async (event) => {
		const { request, locals } = event;
		const { language } = locals;

		if (!locals.user) redirect(302, p['/:lang/authenticate']({ lang: language }));

		const schema = createEmployerProfileSchema(language, false);
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

		return withFiles({ form });
	},
};
