import { SUBSCRIPTION_DOMAINS } from '@sveltevietnam/backend/data/subscribers/domains';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';

export const createSubcribeSchema = (lang: App.Language) => {
	return v.object({
		name: v.pipe(v.string(), v.nonEmpty(m['inputs.name.errors.nonempty'](lang))),
		email: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.email.errors.nonempty'](lang)),
			v.email(m['inputs.email.errors.invalid'](lang)),
		),
		domains: v.pipe(
			v.array(v.picklist(SUBSCRIPTION_DOMAINS), m['forms.subscribe.errors.domains'](lang)),
			v.minLength(1, m['forms.subscribe.errors.domains'](lang)),
		),
		turnstile: v.pipe(v.string(), v.nonEmpty(m['inputs.turnstile.errors.nonempty'](lang))),
	});
};

export type SubscribeInput = v.InferInput<ReturnType<typeof createSubcribeSchema>>;
