import type { StackItemProps } from '@svelte-put/async-stack';
import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BaseNotificationProps<T = any>
	extends Omit<HTMLAttributes<HTMLElement>, 'title'>,
		StackItemProps<T> {
	title?: null | Promise<string> | string | Snippet;
	icon?: string | Snippet;
	status?: 'info' | 'success' | 'warning' | 'error';
}

export const BaseNotification: Component<BaseNotificationProps>;
