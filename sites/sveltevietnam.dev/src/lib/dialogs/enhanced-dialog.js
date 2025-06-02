import { createAttachmentKey } from 'svelte/attachments';

/**
 * @typedef EnhanceDialogAttributes
 * @property {(e: CustomEvent<void>) => void} [onclickbackdrop] - fired when clicked on backdrop
 */

/**
 * @param {MouseEvent} event
 */
function onclick(event) {
	const dialog = /** @type {HTMLDialogElement} */ (event.currentTarget);
	let rect = /** @type {HTMLDialogElement} */ (event.target).getBoundingClientRect();
	if (!event.clientX || !event.clientY) return; // not a mouse event (probably triggered by keyboard)
	if (
		rect.left > event.clientX ||
		rect.right < event.clientX ||
		rect.top > event.clientY ||
		rect.bottom < event.clientY
	) {
		dialog.dispatchEvent(new CustomEvent('clickbackdrop'));
	}
}

/**
 * @param {CustomEvent} event
 */
function onclickbackdrop(event) {
	const dialog = /** @type {HTMLDialogElement} */ (event.currentTarget);
	dialog.close();
}

/**
 * @param {Omit<import('@svelte-put/async-stack').StackItem, '#internals'>} item
 * @param {import('$lib/settings/context.svelte').SettingsContext} settings
 * @returns {import('svelte/elements').HTMLDialogAttributes & EnhanceDialogAttributes}
 */
export function enhanceDialog(item, settings) {
	/**
	 * @param {AnimationEvent} event
	 */
	function onanimationend(event) {
		const dialog = /** @type {HTMLDialogElement} */ (event.currentTarget);
		if (!dialog.open) {
			item.resolve();
			settings.toggleScrollLock(false);
		}
	}

	return {
		class: 'c-dialog',
		onanimationend,
		onclickbackdrop,
		onclick,
		[createAttachmentKey()]: (dialog) => {
			settings.toggleScrollLock(true);
			dialog.showModal();
		},
	};
}
