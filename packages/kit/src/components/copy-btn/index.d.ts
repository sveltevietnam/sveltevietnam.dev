import type { KeySimple } from '@sveltevietnam/i18n-new/generated';
import type { Component } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

export interface CopyBtnProps extends HTMLButtonAttributes {
	textToCopy: string;
	aria: KeySimple;
	iconClass?: string;
}

export const CopyBtn: Component<CopyBtnProps>;
