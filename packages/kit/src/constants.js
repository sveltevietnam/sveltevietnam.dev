export const STATUSES = /** @type {const} */ (['info', 'success', 'warning', 'error']);
/** @typedef {(typeof STATUSES)[number]} Status */

export const COLOR_SCHEMES = /** @type {const} */ (['light', 'dark', 'system']);
/** @typedef {(typeof COLOR_SCHEMES)[number]} ColorScheme */

export const SCREENS = /** @type {const} */ (['mobile', 'tablet', 'desktop']);
/** @typedef {(typeof SCREENS)[number]} Screen */

export const SPLASH_OPTIONS = /** @type {const} */ (['short', 'long', 'random', 'disabled']);
/** @typedef {(typeof SPLASH_OPTIONS)[number]} SplashOption */

/** @type {Parameters<import('@sveltejs/kit').Cookies['set']>[2]} */
export const COMMON_COOKIE_CONFIG = {
	path: '/',
	secure: true,
	httpOnly: true,
	maxAge: 604800, // 7 days
};

/** @type {Parameters<import('@sveltejs/kit').Cookies['set']>[2]} */
export const PUBLIC_COOKIE_CONFIG = {
	...COMMON_COOKIE_CONFIG,
	httpOnly: false,
};
