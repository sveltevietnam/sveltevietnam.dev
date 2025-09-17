import { sequence } from '@sveltejs/kit/hooks';
import {
	createLangServerHook,
	createSplashServerHook,
	createColorSchemeServerHook,
} from '@sveltevietnam/kit/hooks';

import { building } from '$app/environment';
import {
	VITE_PRIVATE_COOKIE_NAME_LANGUAGE,
	VITE_PRIVATE_COOKIE_NAME_LAST_FRESH_VISIT_AT,
} from '$env/static/private';
import {
	VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
	VITE_PUBLIC_COOKIE_NAME_SPLASH,
	VITE_PUBLIC_MODE,
} from '$env/static/public';

const cookieDomain = VITE_PUBLIC_MODE === 'production' ? 'sveltevietnam.dev' : undefined;

export const handle = sequence(
	createLangServerHook({
		cookie: {
			name: VITE_PRIVATE_COOKIE_NAME_LANGUAGE,
			domain: cookieDomain,
		},
	}),
	createColorSchemeServerHook({
		building,
		cookie: {
			name: VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
			domain: cookieDomain,
		},
	}),
	createSplashServerHook({
		splashCookie: {
			name: VITE_PUBLIC_COOKIE_NAME_SPLASH,
			domain: cookieDomain,
		},
		freshVisitCookie: {
			name: VITE_PRIVATE_COOKIE_NAME_LAST_FRESH_VISIT_AT,
			domain: cookieDomain,
		},
	}),
);
