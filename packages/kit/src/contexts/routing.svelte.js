import { getContext, setContext } from 'svelte';

/**
 * @typedef RoutingContextInit
 * @property {Record<import('@sveltevietnam/kit/constants').Language, string>} paths
 * @property {import('@sveltevietnam/kit/constants').Language} lang
 */

export class RoutingContext {
	static KEY = Symbol('app:routing');

	/** @type {RoutingContextInit['paths']} */
	paths = $state({ en: '/en', vi: '/vi' });

	/** @type {RoutingContextInit['lang']} */
	lang = $state('en');

	/** @type string */
	current = $derived(this.paths[this.lang]);

	/**
	 * @param {() => RoutingContextInit} init
	 */
	constructor(init) {
		// run in both SSR and browser
		this.#update(init());

		//  update in browser
		$effect(() => {
			this.#update(init());
		});

		$effect(() => {
			if ('window' in globalThis) {
				document.documentElement.lang = this.lang;
			}
		});
	}

	/**
	 * @param {RoutingContextInit} init
	 */
	#update(init) {
		const { lang, paths } = init;
		this.lang = lang;
		this.paths = paths;
	}

	/**
	 * @param {string} path
	 * @returns {boolean}
	 */
	is(path) {
		return !!this.paths && !!this.lang && this.paths[this.lang] === path;
	}

	/**
	 * @param {() => RoutingContextInit} init
	 */
	static set(init) {
		return setContext(RoutingContext.KEY, new RoutingContext(init));
	}

	/**
	 * @returns {RoutingContext}
	 */
	static get() {
		return getContext(RoutingContext.KEY);
	}
}
