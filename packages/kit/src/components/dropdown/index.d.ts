import type { Component, Snippet } from 'svelte';
import type { HTMLDetailsAttributes } from 'svelte/elements';

export interface DropdownProps extends HTMLDetailsAttributes {
	label?: Snippet;
	content?: Snippet;
	/** @bindable */
	open?: boolean;
}

export const Dropdown: Component<DropdownProps>;
