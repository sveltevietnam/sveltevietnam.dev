import { fail } from '@sveltejs/kit';
import type { Language } from '@sveltevietnam/i18n';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles } from 'sveltekit-superforms/server';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { Actions, PageServerLoad } from './$types';

function createOnboardingSchema(lang: Language) {
	return v.object({
		email: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.email.errors.nonempty'](lang)),
			v.email(m['inputs.email.errors.invalid'](lang)),
		),
		name: v.pipe(v.string(), v.nonEmpty(m['inputs.name.errors.nonempty'](lang))),
		website: v.optional(v.pipe(v.string(), v.url(m['inputs.url.errors.invalid'](lang)))),
		avatar: v.optional(
			v.pipe(
				v.file(),
				v.check(
					(input) => input.type.startsWith('image/'),
					m['pages.onboarding.form.avatar.errors.type'](lang),
				),
				v.maxSize(1024 * 1024, m['pages.onboarding.form.avatar.errors.size'](lang)),
			),
		),
		agreed: v.pipe(
			v.boolean(),
			v.check((value) => value === true, m['pages.onboarding.form.agreement.error'](lang)),
		),
	});
}

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	const schema = createOnboardingSchema(lang);
	return {
		form: await superValidate(valibot(schema)),
		routing: {
			breadcrumbs: b['/:lang/onboarding']({ lang }),
			paths: {
				vi: p['/:lang/onboarding']({ lang: 'vi' }),
				en: p['/:lang/onboarding']({ lang: 'en' }),
			},
		},
	};
};

export const actions: Actions = {
	onboard: async (event) => {
		const { request, locals } = event;
		const { language } = locals;

		const schema = createOnboardingSchema(language);
		const form = await superValidate(request, valibot(schema));
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}
		form.data.email = form.data.email.toLowerCase();

		return withFiles({ form });
	},
};
