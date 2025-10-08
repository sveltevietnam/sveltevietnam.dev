import type { Stack } from '@svelte-put/async-stack';
import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface DialogPortalProps extends HTMLAttributes<HTMLElement> {
	stack: Stack;
}

export const DialogPortal: Component<DialogPortalProps>;
