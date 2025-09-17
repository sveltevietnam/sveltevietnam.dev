import type { StackItemProps } from '@svelte-put/async-stack';
import type { Component } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLDialogAttributes } from 'svelte/elements';

import type { ContentfulProp } from '../../components/contentful';

export interface DialogConfirmationProps
	extends Omit<HTMLDialogAttributes, 'title'>,
		StackItemProps<'confirm' | 'cancel'> {
	title?: ContentfulProp<HTMLAttributes<HTMLParagraphElement>>;
	description?: ContentfulProp<HTMLAttributes<HTMLParagraphElement>>;
	confirm?: ContentfulProp<HTMLButtonAttributes>;
	cancel?: ContentfulProp<HTMLButtonAttributes>;
}

export const DialogConfirmation: Component<DialogConfirmationProps>;
