import { localizeUrl, getLangFromUrl } from '@internals/utils/url';
import type { Cookies, Handle } from '@sveltejs/kit';

import { COOKIE_LANGUAGE, COOKIE_USER_ID, COOKIE_LAST_FRESH_VISIT_AT } from '$env/static/private';
import { PUBLIC_COOKIE_COLOR_SCHEME } from '$env/static/public';
import { LANGUAGES } from '$shared/services/i18n';

const COMMON_COOKIE_CONFIG: Parameters<Cookies['set']>[2] = {
	path: '/',
	secure: true,
	httpOnly: true,
	maxAge: 604800, // 7 days
};

export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies, url, route, platform, request } = event;

	// Ensure that the user has a unique ID
	locals.userId = cookies.get(COOKIE_USER_ID) || crypto.randomUUID();
	cookies.set(COOKIE_USER_ID, locals.userId, COMMON_COOKIE_CONFIG);

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
		// otherwise the beforeNavigate hook in [lang=lang]/+layout.svelte will
		// handle the redirection with kit client-side router
		if (locals.internalReferer) {
			languageFromUrl = getLangFromUrl(locals.internalReferer, LANGUAGES);
			if (languageFromUrl) {
				return Response.redirect(localizeUrl(url, languageFromUrl, LANGUAGES), 302);
			}
		}

		// if user has cookie lang, redirect accordingly
		const cookieLang = cookies.get(COOKIE_LANGUAGE);
		if (cookieLang && cookieLang !== 'vi') {
			return Response.redirect(localizeUrl(url, cookieLang, LANGUAGES), 302);
		}

		// if user comes from a non-VN IP, redirect to EN
		// REF: https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
		const countryCode = platform?.cf?.country;
		if (countryCode && countryCode.toUpperCase() !== 'VN') {
			return Response.redirect(localizeUrl(url, 'en', LANGUAGES), 302);
		}

		return Response.redirect(localizeUrl(url, 'vi', LANGUAGES), 302);
	}
	locals.language = languageFromUrl;
	cookies.set(COOKIE_LANGUAGE, locals.language, COMMON_COOKIE_CONFIG);

	locals.colorScheme =
		(url.searchParams.get('color-scheme') as App.ColorScheme) ||
		(cookies.get(PUBLIC_COOKIE_COLOR_SCHEME) as App.ColorScheme) ||
		'system';
	cookies.set(PUBLIC_COOKIE_COLOR_SCHEME, locals.colorScheme, {
		...COMMON_COOKIE_CONFIG,
		httpOnly: false,
	});

	let shouldSkipSlash = true;
	/**
	 * take a timestamp for the last fresh visit, that is:
	 *   - a visit without an "internal referer" (i.e not navigated from within the site), or
	 *   - after a set amount of time (see maxAge of cookies).
	 *
	 * conveniently, SvelteKit will reset the 'Referer' header on page refresh, so we don't have to
	 * manually catch the unload event and do it ourselves.
	 */
	let lastFreshVisitAt = cookies.get(COOKIE_LAST_FRESH_VISIT_AT);
	if (!lastFreshVisitAt || !locals.internalReferer) {
		shouldSkipSlash = false;
		lastFreshVisitAt = Date.now().toString();
		cookies.set(COOKIE_LAST_FRESH_VISIT_AT, lastFreshVisitAt, {
			...COMMON_COOKIE_CONFIG,
			maxAge: 150, // 2.5 minutes,
		});
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('%cookie-color-scheme%', event.locals.colorScheme)
				.replace('%language%', event.locals.language)
				.replace('%splash-variant%', Math.random() < 0.75 ? 'short' : 'long')
				.replace('%splash-skip%', String(shouldSkipSlash)),
	});

	return response;
};
