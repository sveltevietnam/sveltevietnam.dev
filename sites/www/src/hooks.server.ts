import { localizeUrl, getLangFromUrl } from '@internals/utils/url';
import type { Cookies, Handle } from '@sveltejs/kit';

import { COOKIE_LANGUAGE, COOKIE_USER_ID } from '$env/static/private';
import { PUBLIC_COOKIE_COLOR_SCHEME, PUBLIC_COOKIE_LAST_FRESH_VISIT } from '$env/static/public';
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

	let languageFromUrl = getLangFromUrl(url, LANGUAGES);

	const referer = request.headers.get('Referer');
	if (referer) {
		const urlReferer = new URL(referer);
		if (urlReferer.origin === url.origin) {
			locals.internalReferer = urlReferer;
		}
	}

	if (!languageFromUrl) {
		// if user comes from an internal link with lang, redirect to the same lang
		// this is for progressive enhancement when JS is unavailable,
		// otherwise the beforeNavigate hook in [[lang=lang]]/+layout.svelte will
		// handle the redirection with kit client-side router
		if (locals.internalReferer) {
			languageFromUrl = getLangFromUrl(locals.internalReferer, LANGUAGES);
			if (languageFromUrl) {
				return Response.redirect(localizeUrl(url, languageFromUrl, LANGUAGES), 302);
			}
		}

		// if user has the EN cookie lang, redirect to EN
		const cookieLang = cookies.get(COOKIE_LANGUAGE);
		if (cookieLang && cookieLang !== 'vi') {
			return Response.redirect(localizeUrl(url, cookieLang, LANGUAGES), 302);
		}

		// if user comes from a non-VN country, redirect to EN
		// REF: https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
		const countryCode = platform?.cf?.country;
		if (countryCode && countryCode.toUpperCase() !== 'VN') {
			return Response.redirect(localizeUrl(url, 'en', LANGUAGES), 302);
		}
		languageFromUrl = 'vi';
	}

	locals.colorScheme =
		(url.searchParams.get('color-scheme') as App.ColorScheme) ||
		(cookies.get(PUBLIC_COOKIE_COLOR_SCHEME) as App.ColorScheme) ||
		'system';
	cookies.set(PUBLIC_COOKIE_COLOR_SCHEME, locals.colorScheme, {
		...COMMON_COOKIE_CONFIG,
		httpOnly: false,
	});

	locals.language = languageFromUrl;
	cookies.set(COOKIE_LANGUAGE, locals.language, COMMON_COOKIE_CONFIG);

	let shouldSkipSlash = true;
	/**
	 * take a timestamp for the last fresh visit, that is:
	 *   - a visit without an "internal referer" (i.e not navigated from within the site), or
	 *   - after a set amount of time (see maxAge of cookies).
	 *
	 * conveniently, SvelteKit will reset the 'Referer' header on page refresh, so we don't have to
	 * manually catch the unload event and do it ourselves.
	 */
	let lastFreshVisit = cookies.get(PUBLIC_COOKIE_LAST_FRESH_VISIT);
	if (!lastFreshVisit || !locals.internalReferer) {
		shouldSkipSlash = false;
		lastFreshVisit = Date.now().toString();
		cookies.set(PUBLIC_COOKIE_LAST_FRESH_VISIT, lastFreshVisit, {
			...COMMON_COOKIE_CONFIG,
			httpOnly: false,
			maxAge: 150, // 2.5 minutes,
		});
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('%cookie-color-scheme%', event.locals.colorScheme)
				.replace('%language%', event.locals.language)
				.replace('%splash-variant%', Math.random() < 0.75 ? 'short' : 'long')
				// TODO: is there a way to detect and skip the splash screen if user has already seen one?
				// this would be helpful for user without JS
				// .replace('%splash-skip%', comingFromSameOrigin ? 'true' : 'false'),
				.replace('%splash-skip%', String(shouldSkipSlash)),
	});

	return response;
};
