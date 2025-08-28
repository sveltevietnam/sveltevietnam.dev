import { fail } from '@sveltejs/kit';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles } from 'sveltekit-superforms/server';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { createEmployerProfileSchema } from '$lib/forms/employer-profile';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
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
	};
};

export const actions: Actions = {
	onboard: async (event) => {
		const { request, locals } = event;
		const { language } = locals;

		const schema = createEmployerProfileSchema(language);
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}
		form.data.email = form.data.email.toLowerCase();

		return withFiles({ form });
	},
};
