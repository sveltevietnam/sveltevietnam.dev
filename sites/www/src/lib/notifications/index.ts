import { store } from '@svelte-put/noti';
import { getContext, setContext } from 'svelte';

import type { Language } from '$lib/i18n';

import DiscordNotification from './DiscordNotification.svelte';
import TextOnlyNotification from './TextOnlyNotification.svelte';

const NOTIFICATION_CONTEXT_ID = 'notification';

function createNotificationStore() {
	const notiStore = store({
		timeout: 5000,
	})
		.variant('text-only', TextOnlyNotification)
		.variant('discord', DiscordNotification)
		.build();

	return {
		store: notiStore,
		helpers: {
			info: (content: string) =>
				notiStore.push('text-only', {
					props: {
						content,
						intent: 'info',
					},
				}),
			success: (content: string) =>
				notiStore.push('text-only', {
					props: {
						content,
						intent: 'success',
					},
				}),
			warning: (content: string) =>
				notiStore.push('text-only', {
					props: {
						content,
						intent: 'warning',
					},
				}),
			error: (content: string) =>
				notiStore.push('text-only', {
					props: {
						content,
						intent: 'error',
					},
				}),
			discord: (props: { avatarURL: string; name: string; language: Language }) =>
				notiStore.push('discord', { props }),
		},
	};
}

export function setNotificationContext() {
	return setContext(NOTIFICATION_CONTEXT_ID, createNotificationStore());
}

export function getNotificationContext() {
	return getContext<ReturnType<typeof setNotificationContext>>(NOTIFICATION_CONTEXT_ID);
}
