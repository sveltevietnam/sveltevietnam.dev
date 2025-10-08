import { stack as createStack } from '@svelte-put/async-stack';
import { getContext, setContext } from 'svelte';

import { STATUSES } from '../../constants.js';
import { Toast } from '../toast/index.js';

export class NotificationContext {
	static KEY = Symbol('app:notification');

	/** @type {import('./types.js').NotificationStack} */
	stack;
	/** @type {import('./types.js').Toaster} */
	toaster;

	constructor() {
		this.stack = createStack({ timeout: 4_000 }).addVariant('toast', Toast).build();
		this.toaster = STATUSES.reduce((acc, status) => {
			acc[status] = ({ message, title }) =>
				this.stack.push('toast', {
					props: {
						status,
						title,
						message,
					},
				});
			return acc;
		}, /** @type {import('./types.js').Toaster} */ ({}));
	}

	/**
	 * @returns {NotificationContext}
	 */
	static set() {
		return setContext(NotificationContext.KEY, new NotificationContext());
	}

	/**
	 * @returns {NotificationContext}
	 */
	static get() {
		return getContext(NotificationContext.KEY);
	}
}

export * from './types.js';
