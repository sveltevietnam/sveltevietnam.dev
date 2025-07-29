import { stack, type StackItem } from '@svelte-put/async-stack';
import { createAttachmentKey } from 'svelte/attachments';
import type { HTMLDialogAttributes } from 'svelte/elements';

// :::highlight
/** base stack structure to store and render dialogs into a portal */
export const dialogStack = stack().build();
// :::

// :::highlight
/** enhance the dialog element with some sensible defaults */
export function enhanceDialog(item: Omit<StackItem, '#internals'>) {
	// :::
	// this dialog has an exit animation, so we capture that
	// and resolve the stack item when the animation ends
	function onanimationend(event: AnimationEvent) {
		const dialog = event.currentTarget as HTMLDialogElement;
		if (!dialog.open) {
			// if dialog is setup with "method=dialog" form / inputs
			// this will help capture without the need for JavaScript
			item.resolve(dialog.returnValue || undefined);
		}
	}

	return {
		class: 'c-dialog',
		onanimationend,
		onclickbackdrop,
		onclick,
		[createAttachmentKey()]: (dialog: HTMLDialogElement) => {
			dialog.showModal();
		},
	} satisfies HTMLDialogAttributes & {
		onclickbackdrop?: (event: CustomEvent) => void;
	};
}

/**
 * simulate a `clickbackdrop` event by programmatically
 * detecting clicks outside the dialog
 */
function onclick(event: MouseEvent) {
	const dialog = event.currentTarget as HTMLDialogElement;
	const rect = (event.target as HTMLDialogElement).getBoundingClientRect();
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

/** on clickbackdrop, close the dialog */
function onclickbackdrop(event: CustomEvent) {
	const dialog = event.currentTarget as HTMLDialogElement;
	dialog.close();
}
