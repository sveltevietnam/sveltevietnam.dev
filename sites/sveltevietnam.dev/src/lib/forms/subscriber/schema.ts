import { SUBSCRIPTION_CHANNELS } from '@sveltevietnam/backend/data/subscribers/channels';
import { LANGUAGES } from '@sveltevietnam/i18n';
import type { Language } from '@sveltevietnam/i18n';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';

export const createSubcriberUpsertSchema = (lang: Language) => {
	return v.object({
		name: v.pipe(v.string(), v.nonEmpty(m['inputs.name.errors.nonempty'](lang))),
		email: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.email.errors.nonempty'](lang)),
			v.email(m['inputs.email.errors.invalid'](lang)),
		),
		channels: v.pipe(
			v.array(
				v.picklist(SUBSCRIPTION_CHANNELS),
				m['forms.subscriber.upsert.errors.channels'](lang),
			),
			v.minLength(1, m['forms.subscriber.upsert.errors.channels'](lang)),
		),
		language: v.picklist(LANGUAGES, m['inputs.language.errors.picklist'](lang)),
		turnstile: v.pipe(v.string(), v.nonEmpty(m['inputs.turnstile.errors.nonempty'](lang))),
	});
};
export type SubscribeUpsertInput = v.InferInput<ReturnType<typeof createSubcriberUpsertSchema>>;

export const createSubscriberUpdateSchema = (lang: Language) => {
	return v.object({
		...createSubcriberUpsertSchema(lang).entries,
		id: v.pipe(v.string(), v.nonEmpty(m['inputs.id.errors.nonempty'](lang))),
		channels: v.array(
			v.picklist(SUBSCRIPTION_CHANNELS),
			m['forms.subscriber.upsert.errors.channels'](lang),
		),
	});
};
export type SubscriberUpdateInput = v.InferInput<ReturnType<typeof createSubscriberUpdateSchema>>;
