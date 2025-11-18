import { getContext, setContext } from 'svelte';

/**
 * @typedef {() => (Promise<any> | null | undefined)[]} LoadingAutoTriggers
 */

/**
 * context for triggering global `Loading`
 */
export class LoadingContext {
	static KEY = Symbol('pageload');

	/** @type {LoadingAutoTriggers} */
	#autoTriggers = () => [];
	/** @type {Promise<any>} */
	#manual = $state(Promise.resolve());
	done = $derived(() => Promise.all([...this.#autoTriggers().filter(Boolean), this.#manual]));

	/**
	 * @param {LoadingAutoTriggers} autoTriggers
	 */
	constructor(autoTriggers) {
		this.#autoTriggers = autoTriggers;
	}

	/**
	 * manually trigger a loading state,
	 * @returns {() => void} function to end the loading state
	 */
	load() {
		/** @type {((...args: any) => void) | undefined} */
		let finish = undefined;
		this.#manual = new Promise((resolve) => {
			finish = resolve;
		});
		return () => {
			if (finish) finish();
			this.#manual = Promise.resolve();
		};
	}

	/**
	 * @param {LoadingAutoTriggers} autoTriggers
	 * @returns {LoadingContext}
	 */
	static setGlobal(autoTriggers) {
		return setContext(LoadingContext.KEY, new LoadingContext(autoTriggers));
	}

	/**
	 * @returns {LoadingContext}
	 */
	static getGlobal() {
		return getContext(LoadingContext.KEY);
	}
}
