import type { Language } from '@sveltevietnam/i18n';
import type { SplashOption, Screen } from '@sveltevietnam/kit/constants';
import { getContext, setContext } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { MediaQuery } from 'svelte/reactivity';

import { browser } from '$app/environment';

export class SettingsContext {
	static KEY = Symbol('app:settings');

	// reactive MediaQuery
	#desktopQuery = new MediaQuery('(width >= 64rem)'); /* 1024px */
	#tabletQuery = new MediaQuery('(width >= 48rem)'); /* 768px */

	// $state
	scrolllock = $state(false);
	language = $state<Language>('en');
	hydrated = $state<false | Date>(false);
	splashed = $state<false | Date>(false);
	splash = $state<SplashOption>('random');

	// $derived
	readonly screen = $derived<Screen>(
		this.#desktopQuery.current ? 'desktop' : this.#tabletQuery.current ? 'tablet' : 'mobile',
	);

	constructor(settings: { language: Language; splash: SplashOption }) {
		$effect(() => {
			document.documentElement.setAttribute('lang', this.language);
		});

		const splash = (date: Date) => {
			this.splashed = date;
		};
		if (browser) {
			if (document.documentElement.dataset.splashedAt) {
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				splash(new Date(document.documentElement.dataset.splashedAt));
			} else {
				window.addEventListener('splash', function listener(e) {
					splash((e as CustomEvent<Date>).detail);
					window.removeEventListener('splash', listener);
				});
			}
		}

		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		this.hydrated = browser ? new Date() : false;
		this.language = settings.language;
		this.splash = settings.splash;
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

	static set(settings: { language: Language; splash: SplashOption }) {
		return setContext(SettingsContext.KEY, new SettingsContext(settings));
	}

	static get() {
		return getContext(SettingsContext.KEY) as SettingsContext;
	}
}
