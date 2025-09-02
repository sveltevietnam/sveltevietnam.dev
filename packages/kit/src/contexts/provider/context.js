import { setContext, getContext } from 'svelte';

import { DialogContext } from '../../dialogs/index.js';
import { NotificationContext } from '../../notifications/index.js';
import { ColorSchemeContext } from '../color-scheme.svelte';
import { LockScrollContext } from '../lockscroll.svelte';
import { RoutingContext } from '../routing.svelte';

/**
 * @typedef ContextsInit
 * @property {() => import('../routing.svelte').RoutingContextInit} routing
 * @property {() => import('../color-scheme.svelte').ColorSchemeContextInit} colorScheme
 */

/**
 * call internally to set all contexts
 */
export class Contexts {
	static KEY = Symbol('app:contexts');

	/** @type {Omit<ReturnType<typeof import('@sveltevietnam/kit/contexts').RoutingContext.set>, '#private'>} */
	routing;
	/** @type {Omit<ReturnType<typeof import('@sveltevietnam/kit/contexts').LockScrollContext.set>, '#private'>} */
	lockscroll;
	/** @type {Omit<ReturnType<typeof import('@sveltevietnam/kit/contexts').ColorSchemeContext.set>, '#private'>} */
	colorScheme;
	/** @type {Omit<ReturnType<typeof import('@sveltevietnam/kit/dialogs').DialogContext.set>, '#private'>} */
	dialogs;
	/** @type {Omit<ReturnType<typeof import('@sveltevietnam/kit/notifications').NotificationContext.set>, '#private'>} */
	notifications;

	/**
	 * @param {ContextsInit} init
	 */
	constructor(init) {
		this.routing = RoutingContext.set(init.routing);
		this.lockscroll = LockScrollContext.set();
		this.colorScheme = ColorSchemeContext.set(init.colorScheme);
		this.dialogs = DialogContext.set();
		this.notifications = NotificationContext.set();
	}

	/**
	 * @param {ContextsInit} inits
	 * @return {Contexts}
	 */
	static set(inits) {
		return setContext(Contexts.KEY, new Contexts(inits));
	}

	/**
	 * @returns {Contexts}
	 */
	static get() {
		return getContext(Contexts.KEY);
	}
}
