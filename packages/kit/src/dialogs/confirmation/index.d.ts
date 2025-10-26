/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { StackItemProps } from '@svelte-put/async-stack';
import type { Key } from '@sveltevietnam/i18n-new/generated';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLDialogAttributes } from 'svelte/elements';

import type { ContentfulProps } from '../../components/contentful';

export interface DialogConfirmationProps<
	TitleTKey extends Key = Key,
	DescriptionTKey extends Key = Key,
	ConfirmTKey extends Key = Key,
	CancelTKey extends Key = Key,
> extends Omit<HTMLDialogAttributes, 'title'>,
		StackItemProps<'confirm' | 'cancel'> {
	title?: ContentfulProps<HTMLAttributes<HTMLParagraphElement>, TitleTKey>['content'];
	description?: ContentfulProps<HTMLAttributes<HTMLParagraphElement>, DescriptionTKey>['content'];
	confirm?: ContentfulProps<HTMLButtonAttributes, ConfirmTKey>['content'];
	cancel?: ContentfulProps<HTMLButtonAttributes, CancelTKey>['content'];
}

interface $$IsomorphicComponent {
	new <
		TitleTKey extends Key = Key,
		DescriptionTKey extends Key = Key,
		ConfirmTKey extends Key = Key,
		CancelTKey extends Key = Key,
	>(
		options: import('svelte').ComponentConstructorOptions<
			DialogConfirmationProps<TitleTKey, DescriptionTKey, ConfirmTKey, CancelTKey>
		>,
	): import('svelte').SvelteComponent<
		DialogConfirmationProps<TitleTKey, DescriptionTKey, ConfirmTKey, CancelTKey>
	>;
	<
		TitleTKey extends Key = Key,
		DescriptionTKey extends Key = Key,
		ConfirmTKey extends Key = Key,
		CancelTKey extends Key = Key,
	>(
		internal: unknown,
		props: DialogConfirmationProps<TitleTKey, DescriptionTKey, ConfirmTKey, CancelTKey>,
	): {};
	z_$$bindings?: '';
}
export const DialogConfirmation: $$IsomorphicComponent;
