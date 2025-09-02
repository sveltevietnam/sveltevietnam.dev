import type { Message } from '@sveltevietnam/i18n/runtime';
import type { Component } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export interface CopyBtnProps extends HTMLButtonAttributes {
	textToCopy: string;
	aria: Message<'string', never>;
	iconClass?: string;
}

export const CopyBtn: Component<CopyBtnProps>;
