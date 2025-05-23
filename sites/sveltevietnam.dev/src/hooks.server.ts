import type { Handle } from '@sveltejs/kit';
import { LANGUAGES } from '@sveltevietnam/i18n';
import { getLangFromUrl } from '@sveltevietnam/i18n/utils';

import { building } from '$app/environment';
import {
	VITE_PRIVATE_COOKIE_NAME_USER_ID,
	VITE_PRIVATE_COOKIE_NAME_LANGUAGE,
	VITE_PRIVATE_COOKIE_NAME_LAST_FRESH_VISIT_AT,
} from '$env/static/private';
import {
	VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
	VITE_PUBLIC_COOKIE_NAME_SPLASH,
} from '$env/static/public';
import { COMMON_COOKIE_CONFIG, PUBLIC_COOKIE_CONFIG } from '$lib/constants';

export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies, url, route, platform, request } = event;

	// Ensure that the user has a unique ID
	locals.userId = cookies.get(VITE_PRIVATE_COOKIE_NAME_USER_ID) || crypto.randomUUID();
	cookies.set(VITE_PRIVATE_COOKIE_NAME_USER_ID, locals.userId, COMMON_COOKIE_CONFIG);

	// setting internal referer
	const referer = request.headers.get('Referer');
	if (referer) {
		const urlReferer = new URL(referer);
		if (urlReferer.origin === url.origin) {
			locals.internalReferer = urlReferer;
		}
	}

	let language = getLangFromUrl(url, LANGUAGES);

	// if user comes from an internal link with lang, keep it
	if (!language && locals.internalReferer) {
		language = getLangFromUrl(locals.internalReferer, LANGUAGES);
	}

	// if user has cookie lang, keep it
	if (!language) {
		const cookieLang = cookies.get(VITE_PRIVATE_COOKIE_NAME_LANGUAGE);
		if (cookieLang && LANGUAGES.includes(cookieLang)) {
			language = cookieLang as App.Language;
		}
	}

	// attempt to choose lang based on country of request origin
	// REF: https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
	if (!language) {
		const countryCode = platform?.cf?.country;
		language = countryCode?.toUpperCase() === 'VN' ? 'vi' : 'en';
	}

	// setting locals
	locals.language = language;
	locals.colorScheme =
		(!building && (url.searchParams.get('color-scheme') as App.ColorScheme)) ||
		(cookies.get(VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME) as App.ColorScheme) ||
		'system';
	locals.splash = (cookies.get(VITE_PUBLIC_COOKIE_NAME_SPLASH) as App.SplashOption) || 'random';

	// setting cookies
	cookies.set(VITE_PRIVATE_COOKIE_NAME_LANGUAGE, locals.language, COMMON_COOKIE_CONFIG);
	cookies.set(VITE_PUBLIC_COOKIE_NAME_SPLASH, locals.splash, COMMON_COOKIE_CONFIG);
	cookies.set(VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME, locals.colorScheme, PUBLIC_COOKIE_CONFIG);

	// return early if fetching api routes
	if (route.id?.includes('(api)')) {
		return resolve(event);
	}

	/**
	 * take a timestamp for the last fresh visit, that is:
	 *   - a visit without an "internal referer" (i.e not navigated from within the site), or
	 *   - after a set amount of time (see maxAge of cookies).
	 *
	 * conveniently, SvelteKit will reset the 'Referer' header on page refresh, so we don't have to
	 * manually catch the unload event and do it ourselves.
	 */
	let splash: 'disabled' | 'short' | 'long' = 'disabled';
	const lastFreshVisitAt = cookies.get(VITE_PRIVATE_COOKIE_NAME_LAST_FRESH_VISIT_AT);
	if (!lastFreshVisitAt || !locals.internalReferer) {
		if (locals.splash !== 'disabled') {
			if (locals.splash === 'random') {
				splash = Math.random() < 0.8 ? 'short' : 'long';
			} else {
				splash = locals.splash;
			}
		}
		cookies.set(VITE_PRIVATE_COOKIE_NAME_LAST_FRESH_VISIT_AT, Date.now().toString(), {
			...COMMON_COOKIE_CONFIG,
			maxAge: 150, // 2.5 minutes,
		});
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('%language%', locals.language)
				.replace('%color-scheme%', locals.colorScheme)
				.replace('%splash%', splash),
	});

	return response;
};
