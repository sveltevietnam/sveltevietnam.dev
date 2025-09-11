import { fail, error } from '@sveltejs/kit';
import type { Language } from '@sveltevietnam/i18n';
import {
	createTurnstileValibotClientSchema,
	createTurnstileValibotServerSchema,
} from '@sveltevietnam/kit/utilities';
import { superValidate, message } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PRIVATE_CLOUDFLARE_TURNSTILE_SECRET_KEY } from '$env/static/private';
import { getBackend } from '$lib/backend/utils';

import type { Actions, PageServerLoad } from './$types';

function createEmailSchema(lang: Language) {
	return v.pipe(
		v.string(),
		v.nonEmpty(m['inputs.email.errors.nonempty'](lang)),
		v.email(m['inputs.email.errors.invalid'](lang)),
	);
}

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	const schema = v.object({
		email: createEmailSchema(lang),
		turnstile: createTurnstileValibotClientSchema({
			nonempty: m['inputs.turnstile.errors.nonempty'](lang),
		}),
	});

	return {
		form: await superValidate(valibot(schema)),
		routing: {
			breadcrumbs: b['/:lang/signup']({ lang }),
			paths: {
				vi: p['/:lang/signup']({ lang: 'vi' }),
				en: p['/:lang/signup']({ lang: 'en' }),
			},
		},
	};
};

export const actions: Actions = {
	signup: async (event) => {
		const { request, locals, getClientAddress } = event;
		const { language } = locals;

		const employers = getBackend(event).employers();
		const schema = v.objectAsync({
			turnstile: createTurnstileValibotServerSchema({
				secret: VITE_PRIVATE_CLOUDFLARE_TURNSTILE_SECRET_KEY,
				ip: getClientAddress(),
				messages: {
					nonempty: m['inputs.turnstile.errors.nonempty'](language),
					generic: m['inputs.turnstile.errors.unknown'](language),
				},
			}),
			email: v.pipeAsync(
				createEmailSchema(language),
				v.toLowerCase(),
				v.checkAsync(
					async (email) => !(await employers.exists(email)),
					m['inputs.email.errors.existed'](language),
				),
			),
		});
		const form = await superValidate(
			request,
			valibot(schema, {
				config: {
					abortEarly: true,
				},
			}),
		);
		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: check if verification request already sent
		// rate limit to 1 per 1 minutes

		const { status } = await locals.auth.api.signInMagicLink({
			body: {
				email: form.data.email,
				callbackURL: p['/:lang/onboarding']({ lang: language }),
			},
			headers: request.headers,
		});

		if (!status) {
			// TODO: error logging
			error(500, { code: 'SV001', message: 'Error from backend' });
		}

		// TODO: get the creation date of the verification request for rate limiting
		const date = new Date();

		return message(form, date);
	},
};
