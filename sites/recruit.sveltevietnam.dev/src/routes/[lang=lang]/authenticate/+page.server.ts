import { fail, error, redirect } from '@sveltejs/kit';
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

export const load: PageServerLoad = async ({ params, locals }) => {
	const { lang } = params;
	if (locals.user) {
		if (locals.user.onboardedAt) {
			redirect(302, p['/:lang/postings']({ lang }));
		}
		redirect(302, p['/:lang/onboarding']({ lang }));
	}
	const schema = v.object({
		email: createEmailSchema(lang),
		turnstile: createTurnstileValibotClientSchema({
			nonempty: m['inputs.turnstile.errors.nonempty'](lang),
		}),
	});

	return {
		form: await superValidate(valibot(schema)),
		routing: {
			breadcrumbs: b['/:lang/authenticate']({ lang }),
			paths: {
				vi: p['/:lang/authenticate']({ lang: 'vi' }),
				en: p['/:lang/authenticate']({ lang: 'en' }),
			},
		},
	};
};

export const actions: Actions = {
	default: async (event) => {
		const { request, locals, getClientAddress, url } = event;
		const { language } = locals;

		const schema = v.objectAsync({
			turnstile: createTurnstileValibotServerSchema({
				secret: VITE_PRIVATE_CLOUDFLARE_TURNSTILE_SECRET_KEY,
				ip: getClientAddress(),
				messages: {
					nonempty: m['inputs.turnstile.errors.nonempty'](language),
					generic: m['inputs.turnstile.errors.unknown'](language),
				},
			}),
			email: v.pipeAsync(createEmailSchema(language), v.toLowerCase()),
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

		const { email } = form.data;
		const employers = getBackend().employers();
		let lastVerification = await employers.getLastAuthVerification(email);
		if (lastVerification && new Date() < lastVerification.expiresAt) {
			return message(form, lastVerification.expiresAt);
		}

		const employer = await employers.getByEmail(email);
		const { status } = await locals.auth.api.signInMagicLink({
			body: {
				email: email,
				callbackURL: url.searchParams.get('callback') ?? p['/:lang/postings']({ lang: language }),
				newUserCallbackURL: p['/:lang/onboarding']({ lang: language }),
			},
			headers: request.headers,
			request: new Request(request.url, {
				method: request.method,
				headers: {
					...Object.fromEntries(request.headers.entries()),
					'x-auth-lang': language,
					'x-auth-type': employer?.onboardedAt ? 'login' : 'signup',
					'x-auth-name': employer?.name ?? '',
				},
			}),
		});
		if (!status) {
			// TODO: error logging
			error(500, { code: 'SV001', message: 'Error from backend' });
		}

		lastVerification = await employers.getLastAuthVerification(email);
		return message(form, lastVerification!.expiresAt);
	},
};
