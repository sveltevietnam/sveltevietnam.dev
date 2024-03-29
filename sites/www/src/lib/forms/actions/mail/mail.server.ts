import { getIscClientSecret } from '@internals/db/daos/isc_clients';
import {
	getSubscriptionByEmail,
	upsertSubscription,
	type SubscriptionDomain,
} from '@internals/db/daos/subscriptions';
import { createSendRequest } from '@internals/isc/mailer';
import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { string, object, boolean } from 'zod';

import { ISC_WWW_CLIENT_ID, MAILER_SERVICE_URL } from '$env/static/private';
import { throwSvelteKitError } from '$lib/errors';
import type { FormMessage } from '$lib/forms';
import { validateToken } from '$lib/turnstile/turnstile.server';

import { translations } from './translation';

export function createMailTranslationAndSchema(lang: App.Language) {
	const t = translations[lang].validation;
	const s = object({
		name: string({ invalid_type_error: t.error.captcha.required }).min(1, {
			message: t.error.name.required,
		}),
		email: string({ invalid_type_error: t.error.captcha.required })
			.min(1, { message: t.error.email.required })
			.email({ message: t.error.email.invalid }),
		turnstile: string({ invalid_type_error: t.error.captcha.required }).min(1, {
			message: t.error.captcha.required,
		}),
		checkbox: boolean().optional().default(false),
	});
	return { t, s };
}

export async function mail<E extends RequestEvent>(event: E, domain: SubscriptionDomain) {
	const { request, locals, fetch, platform } = event;

	// get cloudflare bindings for d1 database
	const d1 = platform?.env?.D1;
	if (!d1) throwSvelteKitError('D1_NOT_AVAILABLE');

	// create i18n-aware validation schema
	const { t, s } = createMailTranslationAndSchema(locals.settings.language);

	// parse form object
	const form = await superValidate<typeof s, FormMessage>(request, s);
	if (!form.valid) {
		return fail(400, { form });
	}

	// check cloudflare turnstile captcha
	const turnstile = await validateToken(form.data.turnstile);
	if (!turnstile.success) {
		setError(form, 'turnstile', turnstile.error?.[0] ?? t.error.captcha.unknown);
		return fail(400, { form });
	}

	const { email, name } = form.data;

	const subscription = await getSubscriptionByEmail(d1, email);
	if (domain && subscription?.[domain]) {
		return message(form, {
			type: 'success',
			text: t.alreadyRegister,
		});
	}

	await upsertSubscription(d1, { name, email }, domain);

	const clientSecret = await getIscClientSecret(d1, ISC_WWW_CLIENT_ID);
	if (!clientSecret) throwSvelteKitError('ISC_CLIENT_NOT_FOUND');

	await fetch(
		await createSendRequest(
			{
				templateId: 'WELCOME',
				to: { email, name },
				language: locals.settings.language,
				variables: { name },
			},
			{
				clientID: ISC_WWW_CLIENT_ID,
				clientSecret,
				serviceURL: MAILER_SERVICE_URL,
			},
		),
	).then(async (resp) => {
		if (!resp.ok) {
			const json = await resp.json();
			console.error('/send error:', json);
		}
	});

	return message(form, {
		type: 'success',
		text: t.success,
	});
}
