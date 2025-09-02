import { lockscroll } from '@svelte-put/lockscroll';
import { getContext, setContext } from 'svelte';
import { fromAction } from 'svelte/attachments';

export class LockScrollContext {
	static KEY = Symbol('app:lockscroll');

	// $state
	scrolllock = $state(false);

	/**
	 * @param {boolean} [force]
	 * @returns {void}
	 */
	toggle(force) {
		this.scrolllock = force ?? !this.scrolllock;
	}

	/**
	 * lock scroll when element is mounted, release when unmounted
	 * @returns {import('svelte/attachments').Attachment}
	 **/
	lockWhileMounted = () => () => {
		this.toggle(true);
		return () => {
			this.toggle(false);
		};
	};

	/**
	 * apply lockscroll on this scroll container (usually svelte:document for global lock)
	 * @returns {import('svelte/attachments').Attachment<HTMLElement | Document>}
	 */
	apply = () =>
		fromAction(
			/** @type {import('svelte/action').Action<HTMLElement | Document, boolean>} */ (lockscroll),
			() => this.scrolllock,
		);

	/**
	 * @returns {LockScrollContext}
	 */
	static set() {
		return setContext(LockScrollContext.KEY, new LockScrollContext());
	}

	/**
	 * @returns {LockScrollContext}
	 */
	static get() {
		return getContext(LockScrollContext.KEY);
	}
}
