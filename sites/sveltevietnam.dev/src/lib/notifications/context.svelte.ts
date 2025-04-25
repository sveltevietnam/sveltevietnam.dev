import { stack as createStack } from '@svelte-put/async-stack';
import type { Message, MessageType } from '@sveltevietnam/i18n/runtime';
import { getContext, setContext } from 'svelte';

import { STATUSES } from '$lib/constants';

import Toast from './components/Toast.svelte';

type PushToast = ({
	message,
	title,
}: {
	message: string | Message<MessageType, never>;
	title?: string | Message<MessageType, never> | null;
}) => void;

export function createNotificationStack() {
	const stack = createStack({ timeout: 4_000 }).addVariant('toast', Toast).build();

	const toaster = STATUSES.reduce(
		(acc, status) => {
			acc[status] = ({ message, title }) =>
				stack.push('toast', {
					props: {
						status,
						title,
						message,
					},
				});
			return acc;
		},
		{} as Record<App.Status, PushToast>,
	);

	return {
		stack,
		toaster,
	};
}

type NotificationContextValue = ReturnType<typeof createNotificationStack>;

export class NotificationContext {
	static KEY = 'app:notification';

	static set(init: NotificationContextValue = createNotificationStack()) {
		return setContext(NotificationContext.KEY, init);
	}

	static get() {
		return getContext<NotificationContextValue>(NotificationContext.KEY);
	}
}
