import type { Stack } from '@svelte-put/async-stack';
import type { Component, Snippet } from 'svelte';

import type {
	LoadingContext,
	LockScrollContext,
	NotificationContext,
} from '@sveltevietnam/kit/contexts';

export interface CommonLayoutProps {
	children?: Snippet;
	lockscroll?: LockScrollContext;
	dialogs?: Stack;
	notifications?: NotificationContext;
	globalLoading?: LoadingContext;
}

/**
 * Add global dialog portal, notification portal, lockscroll, and loading
 */
export const CommonLayout: Component<CommonLayoutProps>;
