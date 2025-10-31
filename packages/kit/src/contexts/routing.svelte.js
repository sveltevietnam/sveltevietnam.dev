import { getContext, setContext } from 'svelte';

/**
 * @typedef RoutingContextInit
 * @property {Record<import('@sveltevietnam/kit/constants').Language, string>} paths
 * @property {import('@sveltevietnam/kit/constants').Language} lang
 */

export class RoutingContext {
	static KEY = Symbol('app:routing');

	/** @type {() => RoutingContextInit} */
	#getter = () => ({
		paths: { en: '/en', vi: '/vi' },
		lang: 'en',
	});

	/** @type {RoutingContextInit['paths']} */
	paths = $derived.by(() => this.#getter().paths);

	/** @type {RoutingContextInit['lang']} */
	lang = $derived.by(() => this.#getter().lang);

	/** @type string */
	current = $derived(this.paths[this.lang]);

	/**
	 * @param {() => RoutingContextInit} init
	 */
	constructor(init) {
		this.#getter = init;
		$effect(() => {
			if ('window' in globalThis) {
				document.documentElement.lang = this.lang;
			}
		});
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
