import type { StackItemProps } from '@svelte-put/async-stack';
import type { Component } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';

export interface DialogQrCodeProps extends HTMLDialogAttributes, StackItemProps<void> {
	data: string;
	filename?: string;
	theme: () => 'light' | 'dark';
}

export const DialogQrCode: Component<DialogQrCodeProps>;
