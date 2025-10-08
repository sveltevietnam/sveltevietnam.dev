import type { Stack } from '@svelte-put/async-stack';
import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface NotificationPortalProps extends HTMLAttributes<HTMLElement> {
	stack: Stack;
}

export const NotificationPortal: Component<NotificationPortalProps>;
