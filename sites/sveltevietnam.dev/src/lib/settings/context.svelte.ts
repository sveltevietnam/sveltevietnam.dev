import { getContext, setContext } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';

import { browser } from '$app/environment';
import { VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME } from '$env/static/public';

export class SettingsContext {
	static KEY = 'app:settings';

	// reactive MediaQuery
	#desktopQuery = new MediaQuery('(width >= 64rem)'); /* 1024px */
	#tabletQuery = new MediaQuery('(width >= 48rem)'); /* 768px */
	#preferredColorScheme = new MediaQuery('(prefers-color-scheme: dark)');

	// $state
	#hydrated = $state(false);
	#userColorScheme = $state<App.ColorScheme>('system');
	scrolllock = $state(false);
	language = $state<App.Language>('en');
	splashed = $state(false);
	splash = $state<App.SharedSettings['splash']>('random');

	// $derived
	readonly colorScheme = $derived.by(() => {
		const user = this.#userColorScheme;
		const system = this.#preferredColorScheme.current ? 'dark' : 'light';
		const resolved = user === 'system' ? system : user;
		return { user, system, resolved };
	});
	readonly hydrated = $derived(this.#hydrated);
	readonly screen = $derived<App.Screen>(
		this.#desktopQuery.current ? 'desktop' : this.#tabletQuery.current ? 'tablet' : 'mobile',
	);

	constructor(sharedSettings: App.SharedSettings) {
		$effect(() => {
			if (browser) {
				document.documentElement.dataset.colorScheme = this.colorScheme.user;
				document.cookie = `${VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME}=${this.colorScheme.user}; path=/; SameSite=Lax; Secure; Max-Age=604800`;
			}
		});

		$effect(() => {
			document.documentElement.setAttribute('lang', this.language);
		});

		this.#hydrated = browser;
		this.#userColorScheme = sharedSettings.colorScheme;
		this.language = sharedSettings.language;
		this.splash = sharedSettings.splash;
	}

	setUserColorScheme(colorScheme: App.ColorScheme) {
		this.#userColorScheme = colorScheme;
	}

	toggleScrollLock(force?: boolean) {
		this.scrolllock = force ?? !this.scrolllock;
	}

	static set(sharedSettings: App.SharedSettings) {
		return setContext(SettingsContext.KEY, new SettingsContext(sharedSettings));
	}

	static get() {
		return getContext(SettingsContext.KEY) as SettingsContext;
	}
}
