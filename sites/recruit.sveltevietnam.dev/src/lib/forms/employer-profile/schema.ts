import type { Language } from '@sveltevietnam/i18n';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';

function createEmployerProfileSchemaBase(lang: Language) {
	return v.object({
		name: v.pipe(v.string(), v.nonEmpty(m['inputs.name.errors.nonempty'](lang))),
		website: v.optional(v.pipe(v.string(), v.url(m['inputs.url.errors.invalid'](lang)))),
		description: v.pipe(v.string(), v.nonEmpty(m['inputs.employer.desc.errors.nonempty'](lang))),
		avatar: v.optional(
			v.pipe(
				v.file(),
				v.check(
					(input) => input.type.startsWith('image/'),
					m['inputs.employer.avatar.errors.type'](lang),
				),
				v.maxSize(1024 * 1024, m['inputs.employer.avatar.errors.size'](lang)),
			),
		),
		agreed: v.pipe(
			v.boolean(),
			v.check((value) => value === true, m['inputs.employer.agreement.error'](lang)),
		),
	});
}

export function createEmployerEmailSchema(lang: Language) {
	return v.object({
		email: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.email.errors.nonempty'](lang)),
			v.email(m['inputs.email.errors.invalid'](lang)),
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
