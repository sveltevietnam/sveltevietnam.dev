import type { StackItemProps } from '@svelte-put/async-stack';
import type { Message, MessageType } from '@sveltevietnam/i18n/runtime';
import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface BaseNotificationProps<T = never>
	extends Omit<HTMLAttributes<HTMLElement>, 'title'>,
		StackItemProps<T> {
	title?: string | null | Snippet | Message<MessageType, never>;
	icon?: string | Snippet;
	status?: 'info' | 'success' | 'warning' | 'error';
}

export const BaseNotification: Component<BaseNotificationProps>;
