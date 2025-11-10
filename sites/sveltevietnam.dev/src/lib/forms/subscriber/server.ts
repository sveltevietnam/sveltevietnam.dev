import type { RequestEvent } from '@sveltejs/kit';
import { error, fail } from '@sveltejs/kit';
import * as m from '@sveltevietnam/i18n/generated/messages';
import type { Language } from '@sveltevietnam/kit/constants';
import { validateCloudflareToken } from '@sveltevietnam/kit/utilities';
import { valibot } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';

import { VITE_PRIVATE_CLOUDFLARE_TURNSTILE_SECRET_KEY } from '$env/static/private';
import { getBackend } from '$lib/backend/utils';

import { type SubscriberUpdateInput, createSubscriberUpdateSchema } from './schema';

export const update = {
	async load(lang: Language, mail: Omit<SubscriberUpdateInput, 'turnstile'>) {
		const schema = createSubscriberUpdateSchema(lang);
		return await superValidate(mail, valibot(schema), {
			errors: false,
		});
	},
	async action(event: RequestEvent) {
		const { request, locals, getClientAddress } = event;

		const schema = createSubscriberUpdateSchema(locals.language);
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		form.data.email = form.data.email.toLowerCase();

		// check cloudflare turnstile captcha
		const turnstile = await validateCloudflareToken(
			VITE_PRIVATE_CLOUDFLARE_TURNSTILE_SECRET_KEY,
			form.data.turnstile,
			getClientAddress(),
		);
		if (!turnstile.success) {
			setError(
				form,
				'turnstile',
				turnstile.error?.[0] ?? m['inputs.turnstile.errors.unknown'](locals.language),
			);
			return fail(400, { form });
		}

		const backend = getBackend();
		try {
			const result = await backend.subscribers().update(form.data);
			if (!result.success) {
				// integration error
				console.error(result.errors);
				error(500, { code: 'SV001', message: 'Integration error' });
			}
		} catch (e) {
			// TODO: error logging
			console.error(e);
			error(500, { code: 'SV001', message: 'Error from backend' });
		}
	},
};
