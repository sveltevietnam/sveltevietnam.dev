import type { StackItemProps } from '@svelte-put/async-stack';
import type { Message } from '@sveltevietnam/i18n/runtime';
import type { Component } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';

export interface DialogQrCodeProps extends HTMLDialogAttributes, StackItemProps<void> {
	data: string;
	filename?: string;
	theme: () => 'light' | 'dark';
	i18n: {
		close: Message<'string', never>;
		title: Message<'string', never>;
		desc: Message<'string', never>;
		download: Message<'string', never>;
	};
}

export const DialogQrCode: Component<DialogQrCodeProps>;
