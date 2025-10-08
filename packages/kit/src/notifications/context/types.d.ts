import type { Stack } from '@svelte-put/async-stack';
import type { Message, MessageType } from '@sveltevietnam/i18n/runtime';
import type { Component } from 'svelte';

import type { Status } from '@sveltevietnam/kit/constants';
import type { ToastProps } from '@sveltevietnam/kit/notifications';

export type PushToast = ({
	message,
	title,
}: {
	message: string | Message<MessageType, never>;
	title?: string | Message<MessageType, never> | null;
}) => void;

export type Toaster = Record<Status, PushToast>;
export type NotificationStack = Stack<Record<'toast', Component<ToastProps>>>;
