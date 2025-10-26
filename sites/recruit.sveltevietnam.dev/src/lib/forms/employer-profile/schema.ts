import type { Language } from '@sveltevietnam/kit/constants';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';

function createEmployerProfileSchemaBase(lang: Language) {
	return v.objectAsync({
		name: v.pipe(v.string(), v.nonEmpty(m['inputs.name.errors.nonempty'](lang))),
		website: v.optional(v.pipe(v.string(), v.url(m['inputs.url.errors.invalid'](lang)))),
		description: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.employer.desc.errors.nonempty'](lang)),
			// this is an HTML field so max length should account for HTML tags
			v.maxLength(8000, m['inputs.employer.desc.errors.max'](lang)({ length: '8000' })),
		),
		image: v.optional(
			v.pipe(
				v.file(),
				v.check(
					(input) => input.type.startsWith('image/'),
					m['inputs.employer.image.errors.type'](lang),
				),
				v.maxSize(1024 * 1024, m['inputs.employer.image.errors.size'](lang)),
			),
		),
		agreed: v.pipe(
			v.boolean(),
			v.check((agreed) => agreed === true, m['inputs.employer.agreement.error'](lang)),
		),
	});
}

export function createEmployerEmailSchema(lang: Language) {
	return v.objectAsync({
		email: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.email.errors.nonempty'](lang)),
			v.email(m['inputs.email.errors.invalid'](lang)),
			v.toLowerCase(),
		),
	});
}

function createEmployerProfileSchemaWithEmail(lang: Language) {
	return v.object({
		...createEmployerEmailSchema(lang).entries,
		...createEmployerProfileSchemaBase(lang).entries,
	});
}

export function createEmployerProfileSchema<
	WithEmail extends boolean,
	Schema = true extends WithEmail
		? ReturnType<typeof createEmployerProfileSchemaWithEmail>
		: ReturnType<typeof createEmployerProfileSchemaBase>,
>(lang: Language, withEmail?: WithEmail): Schema {
	if (withEmail) return createEmployerProfileSchemaWithEmail(lang) as Schema;
	return createEmployerProfileSchemaBase(lang) as Schema;
}

export type EmployerProfileInput<WithEmail extends boolean> = true extends WithEmail
	? v.InferInput<ReturnType<typeof createEmployerProfileSchemaWithEmail>>
	: v.InferInput<ReturnType<typeof createEmployerProfileSchemaBase>>;
