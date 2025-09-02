import type { Component, Snippet } from 'svelte';

import type { Contexts } from './context';

export interface ContextsProviderProps {
	children?: Snippet;
	contexts: Contexts;
}

export * from './context.js';
export const ContextsProvider: Component<ContextsProviderProps>;
