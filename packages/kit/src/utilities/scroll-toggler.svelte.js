/**
 * @typedef ScrollTogglerOptions
 * @property {number} minScroll above this should always be visible
 * @property {number} minScrollDelta the least amount of movement to consider a toggle (may experience jank if this is too small)
 */

export class ScrollToggler {
	/** @type {ScrollTogglerOptions} */
	options;
	/** whether the associated element should now be hidden */
	hidden = $state(false);
	/** number between 0 - 1 to indicate how far scrollY has reached with respect to options.minScroll  */
	minScrollProgress = $state(1);

	/**
	 * @param {Partial<ScrollTogglerOptions>} [options]
	 */
	constructor(options = {}) {
		this.options = {
			minScroll: 400,
			minScrollDelta: 100,
			...options,
		};
	}

	/**
	 * @type {import('svelte/attachments').Attachment<HTMLElement>}
	 */
	attachment = () => {
		/** @type {'up' | 'down'} */
		let lastDirection = 'down';
		let lastScrollY = 0;
		let lastScrollYAtDirectionChange = 0;

		const handleScroll = () => {
			const { scrollY } = window;
			const direction = scrollY > lastScrollY ? 'down' : 'up';

			if (scrollY < this.options.minScroll) {
				this.hidden = false;
			} else if (direction !== lastDirection) {
				lastScrollYAtDirectionChange = scrollY;
			} else if (Math.abs(scrollY - lastScrollYAtDirectionChange) > this.options.minScrollDelta) {
				if (direction === 'up') {
					this.hidden = false;
				} else {
					this.hidden = true;
				}
			}

			lastScrollY = scrollY;
			lastDirection = direction;
			this.minScrollProgress = Math.min(scrollY / this.options.minScroll, 1);
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // set initial state
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	};
}
