import { fail, redirect } from '@sveltejs/kit';
import { LANGUAGES } from '@sveltevietnam/i18n';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import * as v from 'valibot';

import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PRIVATE_COOKIE_NAME_LANGUAGE } from '$env/static/private';
import {
	VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
	VITE_PUBLIC_COOKIE_NAME_SPLASH,
} from '$env/static/public';
import {
	COLOR_SCHEMES,
	COMMON_COOKIE_CONFIG,
	PUBLIC_COOKIE_CONFIG,
	SPLASH_OPTIONS,
} from '$lib/constants';

import type { Actions, PageServerLoad } from './$types';
import ogImageEn from './_page/images/og-settings.en.jpg?url';
import ogImageVi from './_page/images/og-settings.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

const SettingsSchema = v.object({
	colorScheme: v.picklist(COLOR_SCHEMES),
	language: v.picklist(LANGUAGES),
	splash: v.picklist(SPLASH_OPTIONS),
	default: v.optional(v.literal('1')),
});

export const load: PageServerLoad = async ({ params, locals }) => {
	const { lang } = params;

	return {
		routing: {
			breadcrumbs: b['/:lang/settings']({ lang }),
			paths: {
				vi: p['/:lang/settings']({ lang: 'vi' }),
				en: p['/:lang/settings']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.settings.title'](lang),
			description: m['pages.settings.desc'](lang),
			og: {
				image: ogImage[lang],
			},
		},
		form: await superValidate(
			{
				language: lang,
				colorScheme: locals.colorScheme,
				splash: locals.splash,
			},
			valibot(SettingsSchema),
		),
	};
};

export const actions: Actions = {
	settings: async ({ request, locals, cookies, params }) => {
		const form = await superValidate(request, valibot(SettingsSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		if (form.data.default) {
			locals.colorScheme = 'system';
			locals.splash = 'random';
		} else {
			locals.colorScheme = form.data.colorScheme;
			locals.splash = form.data.splash;
			locals.language = form.data.language;
		}

		cookies.set(VITE_PRIVATE_COOKIE_NAME_LANGUAGE, locals.language, COMMON_COOKIE_CONFIG);
		cookies.set(VITE_PUBLIC_COOKIE_NAME_SPLASH, locals.splash, COMMON_COOKIE_CONFIG);
		cookies.set(VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME, locals.colorScheme, PUBLIC_COOKIE_CONFIG);

		if (!form.data.default && params.lang !== locals.language) {
			redirect(302, p['/:lang/settings']({ lang: locals.language }));
		}

		return { form, default: !!form.data.default };
	},
};
