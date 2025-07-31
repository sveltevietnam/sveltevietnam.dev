import type { Component } from 'svelte';

export interface LocalesContextValue {
	copy: string;
	collapse: string;
	maximize: string;
}

export function getLocalesContext(): LocalesContextValue;

declare const LocalesContext: Component<LocalesContextValue>;
export default LocalesContext;
