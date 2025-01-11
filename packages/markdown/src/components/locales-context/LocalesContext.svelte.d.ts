import type { Component } from 'svelte';

export interface LocalesContextValue {
	copy: string;
	expand: string;
	collapse: string;
	maximize: string;
	minimize: string;
}

export function getLocalesContext(): LocalesContextValue;

declare const LocalesContext: Component<LocalesContextValue>;
export default LocalesContext;
