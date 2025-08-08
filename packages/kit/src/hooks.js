import { LANGUAGES } from '@sveltevietnam/i18n';
import { getLangFromUrl } from '@sveltevietnam/i18n/utils';

import { COMMON_COOKIE_CONFIG, PUBLIC_COOKIE_CONFIG } from './constants';

/**
 * @param {{ cookieName: string }} options
 * @returns {import('@sveltejs/kit').Handle}
 */
export const createLangServerHook = function (options) {
	return function ({ event, resolve }) {
		const { locals, cookies, url, platform, request, route } = event;
		const { cookieName } = options;

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
			const cookieLang = cookies.get(cookieName);
			if (
				cookieLang &&
				LANGUAGES.includes(/** @type {import('@sveltevietnam/i18n').Language} */ (cookieLang))
			) {
				language = /** @type {import('@sveltevietnam/i18n').Language} */ (cookieLang);
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

		// setting cookies
		cookies.set(cookieName, locals.language, COMMON_COOKIE_CONFIG);

		// return early if fetching api routes
		if (route.id?.includes('(api)')) {
			return resolve(event);
		}

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%language%', locals.language),
		});
	};
};

/**
 * @param {{ cookieName: string, building: boolean }} options
 * @returns {import('@sveltejs/kit').Handle}
 */
export const createColorSchemeServerHook = function (options) {
	return async function ({ event, resolve }) {
		const { locals, cookies, route, url } = event;
		const { cookieName, building } = options;

		// setting locals
		locals.colorScheme =
			(!building &&
				/** @type {import('./constants').ColorScheme} */ (url.searchParams.get('color-scheme'))) ||
			/** @type {import('./constants').ColorScheme} */ (cookies.get(cookieName)) ||
			'system';

		// setting cookies
		cookies.set(cookieName, locals.colorScheme, PUBLIC_COOKIE_CONFIG);

		// return early if fetching api routes
		if (route.id?.includes('(api)')) {
			return resolve(event);
		}

		return await resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%color-scheme%', locals.colorScheme),
		});
	};
};

/**
 * @param {{ splashCookieName: string; freshVisitCookieName: string; }} options
 * @returns {import('@sveltejs/kit').Handle}
 */
export function createSplashServerHook(options) {
	return async function ({ event, resolve }) {
		const { locals, cookies, route, request, url } = event;
		const { splashCookieName, freshVisitCookieName } = options;

		// setting internal referer
		const referer = request.headers.get('Referer');
		if (referer) {
			const urlReferer = new URL(referer);
			if (urlReferer.origin === url.origin) {
				locals.internalReferer = urlReferer;
			}
		}

		// setting locals
		locals.splash =
			/** @type {import('./constants').SplashOption} */ (cookies.get(splashCookieName)) || 'random';

		// setting cookies
		cookies.set(splashCookieName, locals.splash, COMMON_COOKIE_CONFIG);

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
		/** @type {'disabled' | 'short' | 'long' } */
		let splash = 'disabled';
		const lastFreshVisitAt = cookies.get(freshVisitCookieName);
		if (!lastFreshVisitAt || !locals.internalReferer) {
			if (locals.splash !== 'disabled') {
				if (locals.splash === 'random') {
					splash = Math.random() < 0.8 ? 'short' : 'long';
				} else {
					splash = locals.splash;
				}
			}
			cookies.set(freshVisitCookieName, Date.now().toString(), {
				...COMMON_COOKIE_CONFIG,
				maxAge: 150, // 2.5 minutes,
			});
		}

		return await resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%splash%', splash),
		});
	};
}
