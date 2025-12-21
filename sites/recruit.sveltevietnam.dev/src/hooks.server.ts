import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getCookieDomain } from '@sveltevietnam/kit/constants';
import { createLangServerHook, createColorSchemeServerHook } from '@sveltevietnam/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';

import { building } from '$app/environment';
import * as p from '$data/routes/generated';
import { VITE_PRIVATE_COOKIE_NAME_LANGUAGE } from '$env/static/private';
import { VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME, VITE_PUBLIC_MODE } from '$env/static/public';
import { createEmployerAuth } from '$lib/auth';

export const handle = sequence(
	createLangServerHook({
		cookie: {
			name: VITE_PRIVATE_COOKIE_NAME_LANGUAGE,
			domain: getCookieDomain({ mode: VITE_PUBLIC_MODE }),
		},
	}),
	createColorSchemeServerHook({
		building,
		cookie: { name: VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME },
	}),
	async ({ event, resolve }) => {
		// skip homepage
		if (event.route.id === '/' || event.route.id === '/[lang=lang]') return resolve(event);

		// initialize auth
		const auth = createEmployerAuth();
		event.locals.auth = auth;

		const session = await auth.api.getSession({ headers: event.request.headers });
		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;
		}
		if (!event.locals.user && event.route.id?.includes('authenticated')) {
			redirect(
				302,
				p['/:lang/authenticate']({ lang: event.locals.language }) +
					`?callback=${event.url.pathname}`,
			);
		}
		return svelteKitHandler({ event, resolve, auth, building });
	},
);
