import type { Message } from '@sveltevietnam/i18n/runtime';
import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
	email: string;
	domain: string;
	version: string;
	i18n: {
		version: Message<'string', never>;
		svelte_vietnam: Message<'string', never>;
		powered_by: Message<'string', never>;
		not_by_ai: Message<'string', never>;
		about: {
			heading: Message<'string', never>;
			desc: Message<'string', never>;
		};
		navigation: {
			heading: Message<'string', never>;
		};
		contact: {
			heading: Message<'string', never>;
			discord: Message<'string', never>;
		};
	};
	navigationPrimary?: Snippet | ReadonlyArray<{ path: string; name: string }>;
	navigationSecondary?: Snippet | ReadonlyArray<{ path: string; name: string }>;
}

export const Footer: Component<FooterProps>;
