import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface CodeBlockGroupProps extends HTMLAttributes<HTMLElement> {
	/**
	 * number of code blocks inside group
	 * Required but should be injected automatically
	 * by the `enhance-code-block` preprocessor
	 */
	cols: number;
	/**
	 * unique name for group.
	 * Required but should be injected automatically
	 * by the `enhance-code-block` preprocessor
	 */
	name: string;
	/**
	 * display mode for group. Default to `files`
	 */
	display?: 'files' | 'tabs';
	/**
	 * bindable, title of the current active child code block
	 */
	title?: string;
}

export interface CodeBlockGroupContext {
	/** unique id to identify this context */
	id: string;
	/** name for the code block group, mapped to the checkbox input `name` field */
	name: string;
	/** display mode of the code block group */
	display: CodeBlockGroupProps['display'];
	/** initial code block identifier to display */
	title?: string;
	node?: HTMLElement;
}

export function getGroupContext(): CodeBlockGroupContext;

declare const CodeBlockGroup: Component<CodeBlockGroupProps>;
export default CodeBlockGroup;

