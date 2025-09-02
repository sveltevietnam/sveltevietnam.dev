import { type Message, type MessageType } from '@sveltevietnam/i18n/runtime';
import type { Component } from 'svelte';

import { type BaseNotificationProps } from '@sveltevietnam/kit/notifications';

export interface ToastProps extends BaseNotificationProps {
	message: string | Message<MessageType, never>;
}

export const Toast: Component<ToastProps>;
