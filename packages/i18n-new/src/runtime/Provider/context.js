import { getContext, setContext } from 'svelte';

/**
 * @typedef I18NContextValue
 * @property {() => string} lang
 * @property {(content: string) => string} [sanitize]
 */

export class I18NContext {
	static KEY = Symbol('i18n');

	/**
	 * @param {I18NContextValue} value
	 * @returns {I18NContext}
	 */
	static set(value) {
		return setContext(I18NContext.KEY, value);
	}

	/**
	 * @returns {I18NContextValue}
	 */
	static get() {
		return getContext(I18NContext.KEY);
	}
}
