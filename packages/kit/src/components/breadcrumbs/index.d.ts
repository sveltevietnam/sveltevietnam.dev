import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
	crumbs: { path: string; name: string }[];
	scrollIndicator?: 'blur' | 'ellipsis';
}

export const Breadcrumbs: Component<BreadcrumbsProps>;
