import type { Component, Snippet } from 'svelte';

import { type BaseNotificationProps } from '@sveltevietnam/kit/notifications';

export interface ToastProps extends BaseNotificationProps {
	message: Promise<string> | string | Snippet;
}

export const Toast: Component<ToastProps>;
