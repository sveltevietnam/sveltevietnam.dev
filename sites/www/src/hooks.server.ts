import { LANGUAGES, DEFAULT_LANGUAGE, delocalizeLangVar } from '@internals/utils/language';
import { localizeUrl, getLangFromUrl, delocalizeUrl } from '@internals/utils/url';
import { redirect, type Cookies, type Handle } from '@sveltejs/kit';

import { building } from '$app/environment';
import { COOKIE_LANGUAGE, COOKIE_USER_ID, COOKIE_LAST_FRESH_VISIT_AT } from '$env/static/private';
import { PUBLIC_COOKIE_COLOR_SCHEME } from '$env/static/public';
import { ROUTE_MAP } from '$lib/contexts/navigation';
import { INTERNAL_POSTS } from '$lib/data/blog';
import { EVENTS } from '$lib/data/events';

// FIXME: temporary legacy mapping, remove after a while
const REDIRECT_MAP = {
	// common pages
	...Object.values(ROUTE_MAP).reduce(
		(acc, routes) => {
			if (delocalizeUrl(routes.en.path, LANGUAGES) !== delocalizeUrl(routes.vi.path, LANGUAGES)) {
				acc[localizeUrl(routes[DEFAULT_LANGUAGE].path, 'vi', LANGUAGES)] = routes.vi.path;
			}
			return acc;
		},
		{} as Record<string, string>,
	),

	// blog post pages
	...INTERNAL_POSTS.reduce(
		(acc, post) => {
			const delocalizedSlug = delocalizeLangVar(post.slug);
			if (delocalizedSlug.en !== delocalizedSlug.vi) {
				const defaultPath =
					ROUTE_MAP.blog[DEFAULT_LANGUAGE].path + '/' + delocalizedSlug[DEFAULT_LANGUAGE];
				const viPath = ROUTE_MAP.blog.vi.path + '/' + delocalizedSlug.vi;
				acc[localizeUrl(defaultPath, 'vi', LANGUAGES)] = viPath;
			}
			return acc;
		},
		{} as Record<string, string>,
	),

	// event detail pages
	...EVENTS.reduce(
		(acc, event) => {
			const delocalizedSlug = delocalizeLangVar(event.slug);
			if (delocalizedSlug.en !== delocalizedSlug.vi) {
				const defaultPath =
					ROUTE_MAP.events[DEFAULT_LANGUAGE].path + '/' + delocalizedSlug[DEFAULT_LANGUAGE];
				const viPath = ROUTE_MAP.events.vi.path + '/' + delocalizedSlug.vi;
				acc[localizeUrl(defaultPath, 'vi', LANGUAGES)] = viPath;
			}
			return acc;
		},
		{} as Record<string, string>,
	),
};

const COMMON_COOKIE_CONFIG: Parameters<Cookies['set']>[2] = {
	path: '/',
	secure: true,
	httpOnly: true,
	maxAge: 604800, // 7 days
};

export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies, url, route, platform, request } = event;

	if (url.pathname in REDIRECT_MAP) {
		const redirectUrl = new URL(url);
		redirectUrl.pathname = REDIRECT_MAP[url.pathname];
		redirect(301, redirectUrl);
	}

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
				redirect(302, localizeUrl(url, languageFromUrl, LANGUAGES));
			}
		}

		// if user has cookie lang, redirect accordingly
		const cookieLang = cookies.get(COOKIE_LANGUAGE);
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
