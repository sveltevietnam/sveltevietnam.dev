import { getContext, setContext } from 'svelte';
import { derived, writable } from 'svelte/store';

import { browser } from '$app/environment';
import { PUBLIC_COOKIE_SETTINGS_COLOR_SCHEME } from '$env/static/public';

const SETTINGS_CONTEXT_ID = 'settings';

export const DEFAULT_SETTINGS = {
	accessibility: {
		reduceMotion: false,
	},
	colorScheme: 'system',
	splash: 'random',
} satisfies Omit<App.Settings, 'language'>;

/**
 * requires `window.matchMedia` (only in browser context)
 * @returns user's color scheme preference
 */
function getPrefersColorScheme() {
	if (!browser) return 'light';
	return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function createColorSchemeStore(initial: App.ColorScheme) {
	const store = writable<App.ColorScheme>(initial);

	const preferred = derived(store, (c) => (c === 'system' ? getPrefersColorScheme() : c));

	return {
		subscribe: store.subscribe,
		set(scheme: App.ColorScheme) {
			if (browser) {
				document.documentElement.dataset.colorScheme = scheme;
				document.cookie = `${PUBLIC_COOKIE_SETTINGS_COLOR_SCHEME}=${scheme}; path=/; SameSite=Lax; Secure; Max-Age=604800`;
			}
			store.set(scheme);
		},
		preferred,
	};
}

export function setSettingsContext(initial: App.Settings) {
	const language = writable(initial.language);
	const colorScheme = createColorSchemeStore(initial.colorScheme);
	const splash = writable(initial.splash);
	const accessibility = writable(initial.accessibility);

	return setContext(SETTINGS_CONTEXT_ID, {
		language,
		colorScheme,
		splash,
		accessibility,
	});
}

export function getSettingsContext() {
	return getContext<ReturnType<typeof setSettingsContext>>(SETTINGS_CONTEXT_ID);
}
