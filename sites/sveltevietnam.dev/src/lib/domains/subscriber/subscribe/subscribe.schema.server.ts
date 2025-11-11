import { SUBSCRIPTION_CHANNELS } from '@sveltevietnam/backend/data/subscribers/channels';
import * as m from '@sveltevietnam/i18n/generated/messages';
import { createTurnstileValibotServerSchema } from '@sveltevietnam/kit/utilities';
import * as v from 'valibot';

import { getRequestEvent } from '$app/server';
import { VITE_PRIVATE_CLOUDFLARE_TURNSTILE_SECRET_KEY } from '$env/static/private';

export function createSubscribeSchema() {
	const { getClientAddress, locals } = getRequestEvent();
	const lang = locals.language;

	return v.objectAsync({
		name: v.pipe(v.string(), v.nonEmpty(m['inputs.name.errors.nonempty'](lang))),
		email: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.email.errors.nonempty'](lang)),
			v.email(m['inputs.email.errors.invalid'](lang)),
			v.toLowerCase(),
		),
		channels: v.pipe(
			v.array(
				v.picklist(SUBSCRIPTION_CHANNELS),
				m['inputs.subscription_channels.errors.picklist'](lang),
			),
			v.minLength(1, m['inputs.subscription_channels.errors.nonempty'](lang)),
		),
		turnstile: createTurnstileValibotServerSchema({
			secret: VITE_PRIVATE_CLOUDFLARE_TURNSTILE_SECRET_KEY,
			ip: getClientAddress(),
			messages: {
				nonempty: m['inputs.turnstile.errors.nonempty'](lang),
				generic: m['inputs.turnstile.errors.unknown'](lang),
			},
		}),
	});
}

export type SubscribeSchema = ReturnType<typeof createSubscribeSchema>;
export type SubscribeInput = v.InferInput<SubscribeSchema>;
export type SubscribeOutput = v.InferOutput<SubscribeSchema>;
