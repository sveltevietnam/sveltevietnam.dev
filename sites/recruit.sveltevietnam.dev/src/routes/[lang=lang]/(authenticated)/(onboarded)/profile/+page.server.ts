import { fail, error, redirect } from '@sveltejs/kit';
import { valibot } from 'sveltekit-superforms/adapters';
import { message, superValidate, withFiles } from 'sveltekit-superforms/server';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { getBackend } from '$lib/backend/utils';
import { uploadEmployerImage } from '$lib/data/employers';
import {
	createEmployerProfileSchema,
	createEmployerEmailSchema,
} from '$lib/forms/employer-profile';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.user!;
	const { lang } = params;
	const description = await getBackend().employers().getDescriptionById(user.id);
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
				description: description ?? undefined,
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
		meta: {
			title: m['pages.profile.meta.title'](lang).toString(),
		},
	};
};

export const actions: Actions = {
	'update-email': async (event) => {
		const { request, locals } = event;
		const { language } = locals;

		const employers = getBackend().employers();
		const schema = v.objectAsync({
			email: v.pipeAsync(
				createEmployerEmailSchema(language).entries.email,
				v.checkAsync(
					(email) => email !== locals.user!.email,
					m['inputs.email.errors.current'](language),
				),
				v.checkAsync(async (email) => {
					const existed = await employers.exists(email);
					return !existed;
				}, m['inputs.email.errors.existed'](language)),
			),
		});
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const isEmailVerified = await employers.isEmailVerified(locals.user!.id);
		if (!isEmailVerified) {
			// This likely means user just updated their email (email becomes unverified in DB)
			// and should login again to verify their email before they are allowed to change it again
			// we don't kick user out immediately because that would be bad UX
			return message(form, 'unverified');
		}

		const { status } = await locals.auth.api.changeEmail({
			body: { newEmail: form.data.email },
			headers: request.headers,
			request: new Request(request.url, {
				method: request.method,
				headers: {
					...Object.fromEntries(request.headers.entries()),
					'x-auth-lang': language,
				},
			}),
		});

		if (!status) {
			// TODO: error logging
			return message(form, 'error');
		}

		return message(form, 'pending');
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
