import { SUBSCRIPTION_CHANNELS } from '@sveltevietnam/backend/data/subscribers/channels';
import * as m from '@sveltevietnam/i18n/generated/messages';
import { LANGUAGES } from '@sveltevietnam/kit/constants';
import { createTurnstileValibotServerSchema } from '@sveltevietnam/kit/utilities';
import * as v from 'valibot';

import { getRequestEvent } from '$app/server';
import { VITE_PRIVATE_CLOUDFLARE_TURNSTILE_SECRET_KEY } from '$env/static/private';

export function createUpdateSubscriptionSchema() {
	const { getClientAddress, locals } = getRequestEvent();
	const lang = locals.language;

	return v.objectAsync({
		id: v.pipe(v.string(), v.nonEmpty(m['inputs.id.errors.nonempty'](lang))),
		name: v.pipe(v.string(), v.nonEmpty(m['inputs.name.errors.nonempty'](lang))),
		email: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.email.errors.nonempty'](lang)),
			v.email(m['inputs.email.errors.invalid'](lang)),
			v.toLowerCase(),
		),
		language: v.picklist(LANGUAGES, m['inputs.language.errors.picklist'](lang)),
		channels: v.array(
			v.picklist(SUBSCRIPTION_CHANNELS),
			m['inputs.subscription_channels.errors.picklist'](lang),
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

export type UpdateSubscriptionSchema = ReturnType<typeof createUpdateSubscriptionSchema>;
export type UpdateSubscriptionInput = v.InferInput<UpdateSubscriptionSchema>;
export type UpdateSubscriptionOutput = v.InferOutput<UpdateSubscriptionSchema>;
