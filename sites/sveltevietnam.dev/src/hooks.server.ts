import { LANGUAGES } from '@internals/utils/language';
import { localizeUrl, getLangFromUrl } from '@internals/utils/url';
import { redirect, type Handle } from '@sveltejs/kit';

import { building } from '$app/environment';
import { COOKIE_NAME_USER_ID, COOKIE_NAME_LANGUAGE } from '$env/static/private';
import { PUBLIC_COOKIE_NAME_COLOR_SCHEME } from '$env/static/public';
import { COMMON_COOKIE_CONFIG, PUBLIC_COOKIE_CONFIG } from '$lib/constants';

export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies, url, route, platform, request } = event;

	// Ensure that the user has a unique ID
	locals.userId = cookies.get(COOKIE_NAME_USER_ID) || crypto.randomUUID();
	cookies.set(COOKIE_NAME_USER_ID, locals.userId, COMMON_COOKIE_CONFIG);

	// return as is if fetching api routes
	if (route.id?.includes('(api)')) {
		return resolve(event);
	}

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
				redirect(302, localizeUrl(url, languageFromUrl, LANGUAGES));
			}
		}

		// if user has cookie lang, redirect accordingly
		const cookieLang = cookies.get(COOKIE_NAME_LANGUAGE);
		if (cookieLang && cookieLang !== 'vi') {
			redirect(302, localizeUrl(url, cookieLang, LANGUAGES));
		}

		// if user comes from a non-VN IP, redirect to EN
		// REF: https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
		const countryCode = platform?.cf?.country;
		if (countryCode && countryCode.toUpperCase() !== 'VN') {
			redirect(302, localizeUrl(url, 'en', LANGUAGES));
		}

		// pass through during building (kit - prerendering)
		if (building && url.origin === 'http://sveltekit-prerender') languageFromUrl = 'vi';
		else redirect(302, localizeUrl(url, 'vi', LANGUAGES));
	}

	locals.language = languageFromUrl;
	locals.sharedSettings = {
		colorScheme:
			(url.searchParams.get('color-scheme') as App.ColorScheme) ||
			(cookies.get(PUBLIC_COOKIE_NAME_COLOR_SCHEME) as App.ColorScheme) ||
			'system',
	} satisfies App.SharedSettings;

	cookies.set(COOKIE_NAME_LANGUAGE, locals.language, COMMON_COOKIE_CONFIG);
	cookies.set(
		PUBLIC_COOKIE_NAME_COLOR_SCHEME,
		locals.sharedSettings.colorScheme,
		PUBLIC_COOKIE_CONFIG,
	);

	const response = await resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('%language%', locals.language)
				.replace('%color-scheme%', locals.sharedSettings.colorScheme),
	});

	return response;
};
