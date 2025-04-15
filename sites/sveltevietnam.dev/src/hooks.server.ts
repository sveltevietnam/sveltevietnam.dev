import { redirect, type Handle } from '@sveltejs/kit';
import { LANGUAGES } from '@sveltevietnam/i18n';
import { localizeUrl, getLangFromUrl } from '@sveltevietnam/i18n/utils';

import { building } from '$app/environment';
import {
	VITE_PRIVATE_COOKIE_NAME_USER_ID,
	VITE_PRIVATE_COOKIE_NAME_LANGUAGE,
} from '$env/static/private';
import {
	VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
	VITE_PUBLIC_COOKIE_NAME_SPLASH,
	VITE_PUBLIC_ORIGIN,
} from '$env/static/public';
import { COMMON_COOKIE_CONFIG, PUBLIC_COOKIE_CONFIG } from '$lib/constants';

export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies, url, route, platform, request } = event;

	// Ensure that the user has a unique ID
	locals.userId = cookies.get(VITE_PRIVATE_COOKIE_NAME_USER_ID) || crypto.randomUUID();
	cookies.set(VITE_PRIVATE_COOKIE_NAME_USER_ID, locals.userId, COMMON_COOKIE_CONFIG);

	const referer = request.headers.get('Referer');
	if (referer) {
		const urlReferer = new URL(referer);
		if (urlReferer.origin === url.origin) {
			locals.internalReferer = urlReferer;
		}
	}

	let languageFromUrl = getLangFromUrl(url, LANGUAGES);
	if (!languageFromUrl) {
		// if user comes from an internal link with lang, redirect to the same lang
		// this is for progressive enhancement when JS is unavailable,
		// otherwise the beforeNavigate hook in (site)/+layout.svelte will
		// handle the redirection with kit client-side router
		if (locals.internalReferer) {
			languageFromUrl = getLangFromUrl(locals.internalReferer, LANGUAGES);
			if (languageFromUrl) {
				redirect(302, localizeUrl(url, LANGUAGES, languageFromUrl));
			}
		}

		// if user has cookie lang, redirect accordingly
		const cookieLang = cookies.get(VITE_PRIVATE_COOKIE_NAME_LANGUAGE);
		if (cookieLang && cookieLang !== 'vi') {
			redirect(302, localizeUrl(url, LANGUAGES, cookieLang));
		}

		// if user comes from a non-VN IP, redirect to EN
		// REF: https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
		const countryCode = platform?.cf?.country;
		if (countryCode && countryCode.toUpperCase() !== 'VN') {
			redirect(302, localizeUrl(url, LANGUAGES, 'en'));
		}

		// pass through during building (kit - prerendering)
		if (building && url.origin === VITE_PUBLIC_ORIGIN) languageFromUrl = 'vi';
		else redirect(302, localizeUrl(url, LANGUAGES, 'vi'));
	}

	locals.sharedSettings = {
		language: languageFromUrl,
		colorScheme:
			(url.searchParams.get('color-scheme') as App.ColorScheme) ||
			(cookies.get(VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME) as App.ColorScheme) ||
			'system',
		splash:
			(cookies.get(VITE_PUBLIC_COOKIE_NAME_SPLASH) as App.SharedSettings['splash']) || 'random',
	} satisfies App.SharedSettings;
	cookies.set(
		VITE_PRIVATE_COOKIE_NAME_LANGUAGE,
		locals.sharedSettings.language,
		COMMON_COOKIE_CONFIG,
	);
	cookies.set(VITE_PUBLIC_COOKIE_NAME_SPLASH, locals.sharedSettings.splash, COMMON_COOKIE_CONFIG);
	cookies.set(
		VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
		locals.sharedSettings.colorScheme,
		PUBLIC_COOKIE_CONFIG,
	);

	// return early if fetching api routes
	if (route.id?.includes('(api)')) {
		return resolve(event);
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('%language%', locals.sharedSettings.language)
				.replace('%color-scheme%', locals.sharedSettings.colorScheme),
	});

	return response;
};
