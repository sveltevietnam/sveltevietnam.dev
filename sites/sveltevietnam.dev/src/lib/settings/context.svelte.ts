import type { Language } from '@sveltevietnam/i18n';
import type { SplashOption, Screen, ColorScheme } from '@sveltevietnam/kit/constants';
import { getContext, setContext } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { MediaQuery } from 'svelte/reactivity';

import { browser } from '$app/environment';
import { VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME } from '$env/static/public';

export class SettingsContext {
	static KEY = Symbol('app:settings');

	// reactive MediaQuery
	#desktopQuery = new MediaQuery('(width >= 64rem)'); /* 1024px */
	#tabletQuery = new MediaQuery('(width >= 48rem)'); /* 768px */
	#preferredColorScheme = new MediaQuery('(prefers-color-scheme: dark)');

	// $state
	#userColorScheme = $state<ColorScheme>('system');
	scrolllock = $state(false);
	language = $state<Language>('en');
	hydrated = $state<false | Date>(false);
	splashed = $state<false | Date>(false);
	splash = $state<SplashOption>('random');

	// $derived
	readonly colorScheme = $derived.by(() => {
		const user = this.#userColorScheme;
		const system = this.#preferredColorScheme.current ? 'dark' : 'light';
		const resolved = user === 'system' ? system : user;
		return { user, system, resolved };
	});
	readonly screen = $derived<Screen>(
		this.#desktopQuery.current ? 'desktop' : this.#tabletQuery.current ? 'tablet' : 'mobile',
	);

	constructor(settings: { language: Language; colorScheme: ColorScheme; splash: SplashOption }) {
		$effect(() => {
			if (browser) {
				document.documentElement.dataset.colorScheme = this.colorScheme.user;
				document.cookie = `${VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME}=${this.colorScheme.user}; path=/; SameSite=Lax; Secure; Max-Age=604800`;
			}
		});

		$effect(() => {
			document.documentElement.setAttribute('lang', this.language);
		});

		const splash = (date: Date) => {
			this.splashed = date;
		};
		if (browser) {
			if (document.documentElement.dataset.splashedAt) {
				splash(new Date(document.documentElement.dataset.splashedAt));
			} else {
				window.addEventListener('splash', function listener(e) {
					splash((e as CustomEvent<Date>).detail);
					window.removeEventListener('splash', listener);
				});
			}
		}

		this.hydrated = browser ? new Date() : false;
		this.#userColorScheme = settings.colorScheme;
		this.language = settings.language;
		this.splash = settings.splash;
	}

	setUserColorScheme(colorScheme: ColorScheme) {
		this.#userColorScheme = colorScheme;
	}

	toggleScrollLock(force?: boolean) {
		this.scrolllock = force ?? !this.scrolllock;
	}

	/** lock scroll when element is mounted, release when unmounted */
	lockScrollWhenMounted: Attachment = () => {
		this.toggleScrollLock(true);
		return () => {
			this.toggleScrollLock(false);
		};
	};

	get platform() {
		if (!browser) {
			return 'server';
		} else {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const navigator = window.navigator as any;
			const platform = (
				navigator.userAgentData?.platform ?? window.navigator.platform
			).toLowerCase();
			if (platform.includes('mac')) {
				return 'mac';
			} else if (platform.includes('win')) {
				return 'windows';
			} else if (platform.includes('linux')) {
				return 'linux';
			}
			return 'unknown';
		}
	}

	static set(settings: { language: Language; colorScheme: ColorScheme; splash: SplashOption }) {
		return setContext(SettingsContext.KEY, new SettingsContext(settings));
	}

	static get() {
		return getContext(SettingsContext.KEY) as SettingsContext;
	}
}
