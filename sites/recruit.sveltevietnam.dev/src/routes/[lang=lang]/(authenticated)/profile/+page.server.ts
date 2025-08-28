import { fail } from '@sveltejs/kit';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles } from 'sveltekit-superforms/server';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import {
	createEmployerProfileSchema,
	createEmployerEmailSchema,
} from '$lib/forms/employer-profile';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	return {
		updateEmailForm: await superValidate(valibot(createEmployerEmailSchema(lang))),
		updateInfoForm: await superValidate(valibot(createEmployerProfileSchema(lang, false))),
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

		const schema = createEmployerProfileSchema(language, false);
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		return withFiles({ form });
	},
};
