import { HTMLAttributes } from 'svelte/elements';

interface EnhancedCodeBlockProps extends HTMLAttributes<HTMLElement> {
	/**
	 * the programming language
	 */
	lang: string;
	/**
	 * title for the code block
	 */
	title: string;
	/**
	 * whether should hide the line number at start of each line
	 */
	hideLineNumber?: string;
	/**
	 * total number of lines in the code block
	 */
	numLines?: string;
	/**
	 * bindable
	 */
	collapsed?: 'disabled' | string;
}
