import type { SplashOption, Screen } from '@sveltevietnam/kit/constants';
import { platform } from '@sveltevietnam/kit/utilities';
import { getContext, setContext } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';

export class SettingsContext {
	static KEY = Symbol('app:settings');

	platform = platform();

	// reactive MediaQuery
	#desktopQuery = new MediaQuery('(width >= 64rem)'); /* 1024px */
	#tabletQuery = new MediaQuery('(width >= 48rem)'); /* 768px */

	// $state
	hydrated = $state<false | Date>(false);
	splashed = $state<false | Date>(false);
	splash = $state<SplashOption>('random');

	// $derived
	readonly screen = $derived<Screen>(
		this.#desktopQuery.current ? 'desktop' : this.#tabletQuery.current ? 'tablet' : 'mobile',
	);

	constructor(settings: { splash: SplashOption }) {
		const splash = (date: Date) => {
			this.splashed = date;
		};
		if ('window' in globalThis) {
			if (document.documentElement.dataset.splashedAt) {
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				splash(new Date(document.documentElement.dataset.splashedAt));
			} else {
				window.addEventListener('splash', function listener(e) {
					splash((e as CustomEvent<Date>).detail);
					window.removeEventListener('splash', listener);
				});
			}

			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			this.hydrated = new Date();
		}

		this.splash = settings.splash;
	}

	static set(settings: { splash: SplashOption }) {
		return setContext(SettingsContext.KEY, new SettingsContext(settings));
	}

	static get() {
		return getContext(SettingsContext.KEY) as SettingsContext;
	}
}
