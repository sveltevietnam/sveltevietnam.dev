import { fail, redirect } from '@sveltejs/kit';
import type { Language } from '@sveltevietnam/i18n';
import { validateCloudflareToken } from '@sveltevietnam/kit/utilities';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate, setError } from 'sveltekit-superforms/server';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PRIVATE_CLOUDFLARE_TURNSTILE_SECRET_KEY } from '$env/static/private';

import type { Actions, PageServerLoad } from './$types';

function createLoginSchema(lang: Language) {
	return v.object({
		email: v.pipe(
			v.string(),
			v.nonEmpty(m['inputs.email.errors.nonempty'](lang)),
			v.email(m['inputs.email.errors.invalid'](lang)),
		),
		turnstile: v.pipe(v.string(), v.nonEmpty(m['inputs.turnstile.errors.nonempty'](lang))),
	});
}

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	const schema = createLoginSchema(lang);
	return {
		form: await superValidate(valibot(schema)),
		routing: {
			breadcrumbs: b['/:lang/login']({ lang }),
			paths: {
				vi: p['/:lang/login']({ lang: 'vi' }),
				en: p['/:lang/login']({ lang: 'en' }),
			},
		},
	};
};

export const actions: Actions = {
	login: async (event) => {
		const { request, locals, getClientAddress } = event;
		const { language } = locals;

		const schema = createLoginSchema(language);
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
				turnstile.error?.[0] ?? m['inputs.turnstile.errors.unknown'](language),
			);
			return fail(400, { form });
		}

		return { form };
	},
	logout: async ({ params }) => {
		const { lang } = params;
		// TODO: perform logout logic here
		redirect(302, p['/:lang/login']({ lang }));
	},
};
