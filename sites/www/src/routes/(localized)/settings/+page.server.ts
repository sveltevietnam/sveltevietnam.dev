import { LANGUAGES } from '@internals/utils/language';
import { fail, redirect } from '@sveltejs/kit';
import { object, enum as zEnum, coerce } from 'zod';

import {
	PUBLIC_COOKIE_SETTINGS_ACCESSIBILITY_REDUCE_MOTION,
	PUBLIC_COOKIE_SETTINGS_COLOR_SCHEME,
	PUBLIC_COOKIE_SETTINGS_LANGUAGE,
	PUBLIC_COOKIE_SETTINGS_SPLASH,
} from '$env/static/public';
import ogImageEn from '$lib/assets/images/og/og-settings.en.jpg';
import ogImageVi from '$lib/assets/images/og/og-settings.vi.jpg';
import { COLOR_SCHEMES, PUBLIC_COOKIE_CONFIG } from '$lib/constants';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { DEFAULT_SETTINGS } from '$lib/contexts/settings';
import { findRouteFromUrl, prepareRoutePageData } from '$lib/routing/routing.server';

import type { Actions, PageServerLoad } from './$types';
import { translations as pageT } from './_page/translation';

const metaTranslations: Record<App.Language, App.PageData['meta']> = {
	vi: {
		title: 'Cài đặt | Svelte Việt Nam',
		description: 'Tùy chỉnh trải nghiệm của bạn tại sveltevietnam.dev',
		keywords: ['cài đặt', 'tùy chỉnh', 'chế độ', 'hiển thị'],
		og: {
			image: ogImageVi,
		},
	},
	en: {
		title: 'Settings | Svelte Vietnam',
		description: 'Customize your experience at sveltevietnam.dev',
		keywords: ['settings', 'customization', 'mode', 'display'],
		og: {
			image: ogImageEn,
		},
	},
};

const settingsSchema = object({
	accessibilityReduceMotion: coerce.boolean().optional(),
	colorScheme: zEnum(COLOR_SCHEMES).optional(),
	language: zEnum(LANGUAGES).optional(),
	splash: zEnum(['short', 'long', 'random', 'disabled']).optional(),
});

export const load: PageServerLoad = async ({ depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		route: prepareRoutePageData(lang, 'settings'),
		translations: {
			page: pageT[lang],
		},
		events: {
			upcoming: [],
			past: [],
		},
		meta: metaTranslations[lang],
	};
};

export const actions: Actions = {
	update: async (event) => {
		const { request, locals, cookies, url } = event;
		const formData = await request.formData();

		const parsed = settingsSchema.safeParse(Object.fromEntries(formData.entries()));
		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.errors,
			});
		}

		const { accessibilityReduceMotion, colorScheme, language, splash } = parsed.data;

		if (colorScheme !== undefined && colorScheme !== locals.settings.colorScheme) {
			locals.settings.colorScheme = colorScheme;
			cookies.set(PUBLIC_COOKIE_SETTINGS_COLOR_SCHEME, colorScheme, PUBLIC_COOKIE_CONFIG);
		}

		if (splash !== undefined && splash !== locals.settings.splash) {
			locals.settings.splash = splash;
			cookies.set(PUBLIC_COOKIE_SETTINGS_SPLASH, splash, PUBLIC_COOKIE_CONFIG);
		}

		if (
			accessibilityReduceMotion !== undefined &&
			accessibilityReduceMotion !== locals.settings.accessibility.reduceMotion
		) {
			locals.settings.accessibility.reduceMotion = accessibilityReduceMotion;
			cookies.set(
				PUBLIC_COOKIE_SETTINGS_ACCESSIBILITY_REDUCE_MOTION,
				accessibilityReduceMotion.toString(),
				PUBLIC_COOKIE_CONFIG,
			);
		}

		if (language !== undefined && language !== locals.settings.language) {
			locals.settings.language = language;
			cookies.set(PUBLIC_COOKIE_SETTINGS_LANGUAGE, language, PUBLIC_COOKIE_CONFIG);
			const route = findRouteFromUrl(url);
			if (route) {
				redirect(302, route[language].path);
			}
		}
	},
	reset: async (event) => {
		const { locals, cookies } = event;

		locals.settings = {
			...locals.settings,
			...DEFAULT_SETTINGS,
		};

		cookies.set(
			PUBLIC_COOKIE_SETTINGS_COLOR_SCHEME,
			locals.settings.colorScheme,
			PUBLIC_COOKIE_CONFIG,
		);
		cookies.set(PUBLIC_COOKIE_SETTINGS_SPLASH, locals.settings.splash, PUBLIC_COOKIE_CONFIG);
		cookies.set(
			PUBLIC_COOKIE_SETTINGS_ACCESSIBILITY_REDUCE_MOTION,
			locals.settings.accessibility.reduceMotion.toString(),
			PUBLIC_COOKIE_CONFIG,
		);
	},
};
