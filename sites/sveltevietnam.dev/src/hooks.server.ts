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
} from '$env/static/public';

export const handle = sequence(
	createLangServerHook({ cookieName: VITE_PRIVATE_COOKIE_NAME_LANGUAGE }),
	createColorSchemeServerHook({ cookieName: VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME, building }),
	createSplashServerHook({
		splashCookieName: VITE_PUBLIC_COOKIE_NAME_SPLASH,
		freshVisitCookieName: VITE_PRIVATE_COOKIE_NAME_LAST_FRESH_VISIT_AT,
	}),
);
