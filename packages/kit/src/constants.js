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

export const SOCIAL_LINKS = {
	GITHUB: 'https://github.com/sveltevietnam',
	DISCORD: 'https://discord.sveltevietnam.dev',
	BLUESKY: 'https://bsky.app/profile/sveltevietnam.dev',
	FACEBOOK: 'https://facebook.com/sveltevietnam',
	OPEN_COLLECTIVE: 'https://opencollective.com/sveltevietnam',
	YOUTUBE: 'https://www.youtube.com/@sveltevietnam',
	LINKEDIN: 'https://www.linkedin.com/groups/15545035',
	THREADS: 'https://www.threads.com/@sveltevietnam',
};

export const EMAILS = {
	ADMIN: 'admin@sveltevietnam.dev',
	JOBS: 'jobs@sveltevietnam.dev',
	BLOG: 'blog@sveltevietnam.dev',
	CONTACT: 'contact@sveltevietnam.dev',
	COC: 'coc@sveltevietnam.dev',
	EVENTS: 'events@sveltevietnam.dev',
	IMPACT: 'impact@sveltevietnam.dev',
	SPONSOR: 'sponsor@sveltevietnam.dev',
};

export const LANGUAGES = /** @type {const} */ (['en', 'vi']);
/** @typedef {(typeof LANGUAGES)[number]} Language */
