import { HTMLAttributes } from 'svelte/elements';

interface EnhancedCodeBlockGroupProps extends HTMLAttributes<HTMLElement> {
	cols: number;
	name: string;
	display?: 'files' | 'tabs';
	/**
	 * bindable, title of the current active child code block
	 */
	title?: string;
}
