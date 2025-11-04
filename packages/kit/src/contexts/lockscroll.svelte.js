import { getContext, setContext } from 'svelte';

/**
 * @param {HTMLElement} node
 */
function lock(node) {
	const scrollBarWidth = window.innerWidth - document.body.clientWidth;
	node.style.paddingRight = `${scrollBarWidth}px`;
	node.style.overflow = 'hidden';
}

/**
 * @param {HTMLElement} node
 */
function unlock(node) {
	node.style.overflow = '';
	node.style.paddingRight = '';
}

export class LockScrollContext {
	static KEY = Symbol('app:lockscroll');

	// $state
	scrolllock = $state(false);

	/**
	 * @param {boolean} [scrolllock]
	 */
	constructor(scrolllock) {
		if (scrolllock !== undefined) {
			this.scrolllock = scrolllock;
		}
	}

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
	apply = () => (node) => {
		let rNode = /** @type {HTMLElement} */ (
			node.isSameNode(document) ? document.documentElement : node
		);
		if (this.scrolllock) {
			lock(rNode);
		} else {
			unlock(rNode);
		}
		return () => {
			unlock(rNode);
		};
	};

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
