import type { Component, Snippet } from 'svelte';
import type { HTMLDetailsAttributes } from 'svelte/elements';

export interface DropdownProps extends HTMLDetailsAttributes {
	/**
	 * whether to open dropdown upward or downward. Default to
	 * @default 'down'
	 */
	direction?: 'up' | 'down';
	/**
	 * whether to align dropdown menu to left or right of trigger. Default to 'right'
	 * @default 'right'
	 */
	align?: 'left' | 'right';
	label?: Snippet;
	content?: Snippet;
	/** @bindable */
	open?: boolean;
}

export const Dropdown: Component<DropdownProps>;
