import type { Message } from '@sveltevietnam/i18n/runtime';
import type { Component } from 'svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';

export interface NotByAiBadgeProps extends HTMLAnchorAttributes {
	/** i18n-aware screen-reader text for the badge */
	sr: Message<'string', never>;
}

export const NotByAiBadge: Component<NotByAiBadgeProps>;
