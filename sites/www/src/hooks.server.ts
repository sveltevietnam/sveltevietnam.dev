import { LANGUAGES, DEFAULT_LANGUAGE, delocalizeLangVar } from '@internals/utils/language';
import { localizeUrl, getLangFromUrl, delocalizeUrl } from '@internals/utils/url';
import { redirect, type Handle } from '@sveltejs/kit';

import { building } from '$app/environment';
import { COOKIE_USER_ID, COOKIE_LAST_FRESH_VISIT_AT } from '$env/static/private';
import {
	PUBLIC_COOKIE_SETTINGS_ACCESSIBILITY_REDUCE_MOTION,
	PUBLIC_COOKIE_SETTINGS_COLOR_SCHEME,
	PUBLIC_COOKIE_SETTINGS_LANGUAGE,
	PUBLIC_COOKIE_SETTINGS_SPLASH,
} from '$env/static/public';
import { COMMON_COOKIE_CONFIG, PUBLIC_COOKIE_CONFIG } from '$lib/constants';
import { INTERNAL_POSTS } from '$lib/data/blog';
import { EVENTS } from '$lib/data/events';
import { ROUTE_MAP } from '$lib/routing/routing.map';

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

export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies, url, route, platform, request } = event;

	// Ensure that the user has a unique ID
	locals.userId = cookies.get(COOKIE_USER_ID) || crypto.randomUUID();
	cookies.set(COOKIE_USER_ID, locals.userId, COMMON_COOKIE_CONFIG);

	// return as is if fetching api routes
	if (route.id?.includes('(api)')) {
		return resolve(event);
	}

	if (url.pathname in REDIRECT_MAP) {
		const redirectUrl = new URL(url);
		redirectUrl.pathname = REDIRECT_MAP[url.pathname];
		redirect(301, redirectUrl);
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
		// otherwise the beforeNavigate hook in (localized)/+layout.svelte will
		// handle the redirection with kit client-side router
		if (locals.internalReferer) {
			languageFromUrl = getLangFromUrl(locals.internalReferer, LANGUAGES);
			if (languageFromUrl) {
				redirect(302, localizeUrl(url, languageFromUrl, LANGUAGES));
			}
		}

		// if user has cookie lang, redirect accordingly
		const cookieLang = cookies.get(PUBLIC_COOKIE_SETTINGS_LANGUAGE);
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

	locals.settings = {
		language: languageFromUrl,
		colorScheme:
			(url.searchParams.get('color-scheme') as App.ColorScheme) ||
			(cookies.get(PUBLIC_COOKIE_SETTINGS_COLOR_SCHEME) as App.ColorScheme) ||
			'system',
		splash: (cookies.get(PUBLIC_COOKIE_SETTINGS_SPLASH) as App.Settings['splash']) || 'random',
		accessibility: {
			reduceMotion: cookies.get(PUBLIC_COOKIE_SETTINGS_ACCESSIBILITY_REDUCE_MOTION) === 'true',
		},
	} satisfies App.Settings;

	// get & set settings.language
	cookies.set(PUBLIC_COOKIE_SETTINGS_LANGUAGE, locals.settings.language, COMMON_COOKIE_CONFIG);
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

	let shouldSkipSlash = true;
	let splashVariant = Math.random() < 0.75 ? 'short' : 'long';
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
		if (locals.settings.splash !== 'disabled') {
			shouldSkipSlash = false;
			if (locals.settings.splash !== 'random') {
				splashVariant = locals.settings.splash;
			}
		}
		lastFreshVisitAt = Date.now().toString();
		cookies.set(COOKIE_LAST_FRESH_VISIT_AT, lastFreshVisitAt, {
			...COMMON_COOKIE_CONFIG,
			maxAge: 150, // 2.5 minutes,
		});
	}

	const response = await resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('%language%', locals.settings.language)
				.replace('%color-scheme%', locals.settings.colorScheme)
				.replace('%reduce-motion%', locals.settings.accessibility.reduceMotion.toString())
				.replace('%splash-variant%', splashVariant)
				.replace('%splash-skip%', String(shouldSkipSlash)),
	});

	return response;
};
