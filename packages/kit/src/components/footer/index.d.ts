import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
	email: string;
	domain: string;
	version: string;
	navigationPrimary?: Snippet | ReadonlyArray<{ path: string; name: string }>;
	navigationSecondary?: Snippet | ReadonlyArray<{ path: string; name: string }>;
}

export const Footer: Component<FooterProps>;
