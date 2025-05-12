import type { RequestEvent } from '@sveltejs/kit';
import { error, fail } from '@sveltejs/kit';
import type { SubscriptionDomain } from '@sveltevietnam/backend/data/subscribers/domains';
import { valibot } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';

import * as m from '$data/locales/generated/messages';
import { validateToken } from '$lib/turnstile/turnstile.server';

import { createSubcribeSchema } from './schema';

export async function load(lang: App.Language, domain: SubscriptionDomain) {
	const schema = createSubcribeSchema(lang);
	return await superValidate(
		{
			domains: [domain],
		},
		valibot(schema),
		{
			errors: false,
		},
	);
}

export async function action(event: RequestEvent) {
	const { request, locals, platform, getClientAddress } = event;

	const schema = createSubcribeSchema(locals.language);
	const form = await superValidate(request, valibot(schema));
	if (!form.valid) {
		return fail(400, { form });
	}

	// check cloudflare turnstile captcha
	const turnstile = await validateToken(form.data.turnstile, getClientAddress());
	if (!turnstile.success) {
		setError(
			form,
			'turnstile',
			turnstile.error?.[0] ?? m['inputs.turnstile.errors.unknown'](locals.language),
		);
		return fail(400, { form });
	}

	const backend = platform?.env?.backend;
	if (!backend) {
		// TODO: error logging
		error(500, { code: 'SV001', message: 'Backend not available' });
	}
	try {
		await backend.subscribers().upsert(form.data);
	} catch (e) {
		// TODO: error logging
		console.error(e);
		error(500, { code: 'SV001', message: 'Error from backend' });
	}
}
