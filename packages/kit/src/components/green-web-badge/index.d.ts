import type { Component } from 'svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';

export interface GreenWebBadgeProps extends HTMLAnchorAttributes {
	domain: string;
}

export const GreenWebBadge: Component<GreenWebBadgeProps>;
