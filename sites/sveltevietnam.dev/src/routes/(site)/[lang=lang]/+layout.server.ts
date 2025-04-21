import { VITE_PRIVATE_COOKIE_NAME_LAST_FRESH_VISIT_AT } from '$env/static/private';
import { COMMON_COOKIE_CONFIG } from '$lib/constants';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, cookies, params }) => {
	let splash: 'disabled' | 'short' | 'long' = 'disabled';
	/**
	 * take a timestamp for the last fresh visit, that is:
	 *   - a visit without an "internal referer" (i.e not navigated from within the site), or
	 *   - after a set amount of time (see maxAge of cookies).
	 *
	 * conveniently, SvelteKit will reset the 'Referer' header on page refresh, so we don't have to
	 * manually catch the unload event and do it ourselves.
	 */
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

	return {
		splash,
		settings: {
			language: params.lang || locals.language,
			colorScheme: locals.colorScheme,
			splash: locals.splash,
		},
	};
};
