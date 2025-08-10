import { sequence } from '@sveltejs/kit/hooks';
import { createLangServerHook, createColorSchemeServerHook } from '@sveltevietnam/kit/hooks';

import { building } from '$app/environment';
import { VITE_PRIVATE_COOKIE_NAME_LANGUAGE } from '$env/static/private';
import { VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME } from '$env/static/public';

export const handle = sequence(
	createLangServerHook({ cookieName: VITE_PRIVATE_COOKIE_NAME_LANGUAGE }),
	createColorSchemeServerHook({ cookieName: VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME, building }),
);
