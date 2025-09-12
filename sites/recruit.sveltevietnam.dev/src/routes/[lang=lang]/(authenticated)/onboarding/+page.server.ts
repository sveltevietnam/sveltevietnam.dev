import { error, fail, redirect } from '@sveltejs/kit';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles } from 'sveltekit-superforms/server';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { getEmployerImagePath } from '$lib/backend/utils';
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

		// upload image
		let imageUrl: undefined | string = undefined;
		if (image) {
			imageUrl = getEmployerImagePath(id);
			await r2.put(getEmployerImagePath(id), await image.bytes(), {
				httpMetadata: {
					contentType: image.type,
					cacheControl: 'public, max-age=86400, immutable',
				},
			});
			imageUrl = VITE_PUBLIC_ORIGIN + imageUrl;
		}

		const { status } = await locals.auth.api.updateUser({
			body: {
				...update,
				image: imageUrl,
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
