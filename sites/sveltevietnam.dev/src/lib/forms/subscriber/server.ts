import type { RequestEvent } from '@sveltejs/kit';
import { error, fail } from '@sveltejs/kit';
import type { SubscriptionChannel } from '@sveltevietnam/backend/data/subscribers/channels';
import { valibot } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';

import * as m from '$data/locales/generated/messages';
import { getBackend } from '$lib/backend/server';
import { validateToken } from '$lib/turnstile/turnstile.server';

import {
	createSubcriberUpsertSchema,
	type SubscriberUpdateInput,
	createSubscriberUpdateSchema,
} from './schema';

export const upsert = {
	async load(lang: App.Language, channel: SubscriptionChannel) {
		const schema = createSubcriberUpsertSchema(lang);
		return await superValidate(
			{
				language: lang,
				channels: [channel],
			},
			valibot(schema),
			{
				errors: false,
			},
		);
	},
	async action(event: RequestEvent) {
		const { request, locals, platform, getClientAddress } = event;

		const schema = createSubcriberUpsertSchema(locals.language);
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

		const backend = getBackend(platform);
		try {
			const result = await backend.subscribers().upsert(form.data);
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

export const update = {
	async load(lang: App.Language, mail: Omit<SubscriberUpdateInput, 'turnstile'>) {
		const schema = createSubscriberUpdateSchema(lang);
		return await superValidate(mail, valibot(schema), {
			errors: false,
		});
	},
	async action(event: RequestEvent) {
		const { request, locals, platform, getClientAddress } = event;

		const schema = createSubscriberUpdateSchema(locals.language);
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

		const backend = getBackend(platform);
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
