import { stack } from '@svelte-put/async-stack';
import { getContext, setContext } from 'svelte';

export class DialogContext {
	static KEY = Symbol('app:dialogs');

	/**
	 * @returns {import('@svelte-put/async-stack').Stack}
	 */
	static set() {
		return setContext(DialogContext.KEY, stack().build());
	}

	/**
	 * @returns {import('@svelte-put/async-stack').Stack}
	 */
	static get() {
		return getContext(DialogContext.KEY);
	}
}
