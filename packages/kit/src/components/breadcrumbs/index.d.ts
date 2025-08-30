import type { Message } from '@sveltevietnam/i18n/runtime';
import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
	crumbs: { path: string; name: string }[];
	scrollIndicator?: 'blur' | 'ellipsis';
	i18n: {
		aria: Message<'string', never>;
		home: Message<'string', never>;
	};
}

export const Breadcrumbs: Component<BreadcrumbsProps>;
