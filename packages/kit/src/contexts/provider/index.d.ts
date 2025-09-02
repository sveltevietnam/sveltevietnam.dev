import type { Component, Snippet } from 'svelte';

import {
	type ColorSchemeContext,
	type ColorSchemeContextInit,
	type LockScrollContext,
	type RoutingContext,
	type RoutingContextInit,
} from '@sveltevietnam/kit/contexts';
import { type DialogContext } from '@sveltevietnam/kit/dialogs';

export interface ContextsInit {
	routing: () => RoutingContextInit;
	colorScheme: () => ColorSchemeContextInit;
}

/**
 * call internally to set all contexts
 */
export class Contexts {
	static KEY: string;

	routing: Omit<ReturnType<typeof RoutingContext.set>, '#private'>;
	lockscroll: Omit<ReturnType<typeof LockScrollContext.set>, '#private'>;
	colorScheme: Omit<ReturnType<typeof ColorSchemeContext.set>, '#private'>;
	dialogs: Omit<ReturnType<typeof DialogContext.set>, '#private'>;

	constructor(init: ContextsInit);
	static set(init: ContextsInit): Contexts;
	static get(): Contexts;
}

export interface ContextsProviderProps {
	children?: Snippet;
	contexts: Contexts;
}

export const ContextsProvider: Component<ContextsProviderProps>;
