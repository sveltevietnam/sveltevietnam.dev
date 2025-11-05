import type { Component, Snippet } from 'svelte';

import type { CreateContextsOutput } from '.';

export interface ProviderProps {
	children?: Snippet;
	contexts: CreateContextsOutput;
}

declare const Provider: Component<ProviderProps>;
export default Provider;
