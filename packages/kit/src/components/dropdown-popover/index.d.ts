import type { OffsetOptions, Placement } from '@floating-ui/dom';
import type { Component, Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export interface DropdownPopoverProps extends HTMLButtonAttributes {
	/** generated if not provided */
	id?: string;
	placement?: Placement;
	offset?: OffsetOptions;
	label?: Snippet;
	content?: Snippet;
	/** @bindable */
	open?: boolean;
}

export const DropdownPopover: Component<DropdownPopoverProps>;
