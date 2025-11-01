import type { StackItemProps } from '@svelte-put/async-stack';
import type { Component } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLDialogAttributes } from 'svelte/elements';

import type { ContentfulProps } from '../../components/contentful';

export interface DialogConfirmationProps
	extends Omit<HTMLDialogAttributes, 'title'>,
		StackItemProps<'confirm' | 'cancel'> {
	title?: ContentfulProps<HTMLAttributes<HTMLParagraphElement>>['content'];
	description?: ContentfulProps<HTMLAttributes<HTMLParagraphElement>>['content'];
	confirm?: ContentfulProps<HTMLButtonAttributes>['content'];
	cancel?: ContentfulProps<HTMLButtonAttributes>['content'];
}

export const DialogConfirmation: Component<DialogConfirmationProps>;
