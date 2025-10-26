import { getLangFromUrl } from '@sveltevietnam/i18n-new/utils';

import { LANGUAGES } from '@sveltevietnam/kit/constants';

import { COMMON_COOKIE_CONFIG, PUBLIC_COOKIE_CONFIG } from './constants';

/**
 * @typedef LangServerHookOptions
 * @property {{ name: string; domain?: string }} cookie - cookie configuration
 * @property {string | boolean} [transform] - whether to inject the placeholder in returned html with the language value. Defaults to `%language%`.
 */

/**
 * @param {LangServerHookOptions} options
 * @returns {import('@sveltejs/kit').Handle}
 */
export const createLangServerHook = function (options) {
	return function ({ event, resolve }) {
		const { locals, cookies, url, platform, request } = event;
		const { cookie, transform } = options;

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
			const cookieLang = cookies.get(cookie.name);
			if (
				cookieLang &&
				LANGUAGES.includes(
					/** @type {import('@sveltevietnam/kit/constants').Language} */ (cookieLang),
				)
			) {
				language = /** @type {import('@sveltevietnam/kit/constants').Language} */ (cookieLang);
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
		cookies.set(cookie.name, locals.language, {
			...COMMON_COOKIE_CONFIG,
			domain: cookie.domain,
		});

		if (transform === false) return resolve(event);
		const placeholder = typeof transform === 'string' ? transform : '%language%';
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace(placeholder, locals.language),
		});
	};
};

/**
 * @typedef ColorSchemeServerHookOptions
 * @property {{ name: string; domain?: string }} cookie - cookie configuration
 * @property {boolean} building - usually import('$app/environment').building
 * @property {boolean | string} [transform] - whether to inject the placeholder in returned html with the color scheme value. Defaults to `%color-scheme%`.
 */

/**
 * @param {ColorSchemeServerHookOptions} options
 * @returns {import('@sveltejs/kit').Handle}
 */
export const createColorSchemeServerHook = function (options) {
	return async function ({ event, resolve }) {
		const { locals, cookies, url } = event;
		const { cookie, building, transform } = options;

		// setting locals
		locals.colorScheme =
			(!building &&
				/** @type {import('./constants').ColorScheme} */ (url.searchParams.get('color-scheme'))) ||
			/** @type {import('./constants').ColorScheme} */ (cookies.get(cookie.name)) ||
			'system';

		// setting cookies
		cookies.set(cookie.name, locals.colorScheme, {
			...PUBLIC_COOKIE_CONFIG,
			domain: cookie.domain,
		});

		if (transform === false) return resolve(event);
		const placeholder = typeof transform === 'string' ? transform : '%color-scheme%';
		return await resolve(event, {
			transformPageChunk: ({ html }) => html.replace(placeholder, locals.colorScheme),
		});
	};
};

/**
 * @typedef SplashServerHookOptions
 * @property {{ name: string; domain?: string }} splashCookie - cookie configuration for splash option
 * @property {{ name: string; domain?: string }} freshVisitCookie - cookie configuration for fresh visit timestamp
 * @property {boolean | string} [transform] - whether to inject the placeholder in returned html with the splash value. Defaults to `%splash%`.
 */

/**
 * @param {SplashServerHookOptions} options
 * @returns {import('@sveltejs/kit').Handle}
 */
export function createSplashServerHook(options) {
	return async function ({ event, resolve }) {
		const { locals, cookies, request, url } = event;
		const { splashCookie, freshVisitCookie, transform } = options;

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
			/** @type {import('./constants').SplashOption} */ (cookies.get(splashCookie.name)) ||
			'random';

		// setting cookies
		cookies.set(splashCookie.name, locals.splash, {
			...COMMON_COOKIE_CONFIG,
			domain: splashCookie.domain,
		});

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
		const lastFreshVisitAt = cookies.get(freshVisitCookie.name);
		if (!lastFreshVisitAt || !locals.internalReferer) {
			if (locals.splash !== 'disabled') {
				if (locals.splash === 'random') {
					splash = Math.random() < 0.8 ? 'short' : 'long';
				} else {
					splash = locals.splash;
				}
			}
			cookies.set(freshVisitCookie.name, Date.now().toString(), {
				...COMMON_COOKIE_CONFIG,
				domain: freshVisitCookie.domain,
				maxAge: 150, // 2.5 minutes,
			});
		}

		if (transform === false) return resolve(event);
		const placeholder = typeof transform === 'string' ? transform : '%splash%';
		return await resolve(event, {
			transformPageChunk: ({ html }) => html.replace(placeholder, splash),
		});
	};
}
