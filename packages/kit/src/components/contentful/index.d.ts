/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Message } from '@sveltevietnam/i18n/runtime';
import type { Snippet } from 'svelte';

interface SnippetProp {
	snippet: Snippet<[any]>;
	params?: any;
}

interface ExtendedHTMLProp<Attributes extends Record<string, any>> {
	content: string | Message<'string', never>;
	attributes?: Attributes;
}

export type ContentfulProp<Attributes extends Record<string, any>> =
	| string
	| Message<'string', never>
	| SnippetProp
	| ExtendedHTMLProp<Attributes>;

export type ContentfulProps<Attributes extends Record<string, any>> = {
	prop: ContentfulProp<Attributes>;
	tag: keyof HTMLElementTagNameMap;
} & Attributes;

/// mimic output of svelte-package to support generics

declare class __sveltets_Render<Attributes extends Record<string, any>> {
	props(): ContentfulProps<Attributes>;
	events(): {} & {
		[evt: string]: CustomEvent<any>;
	};
	slots(): {};
	bindings(): string;
	exports(): {};
}

interface $$IsomorphicComponent {
	new <Attributes extends Record<string, any>>(
		options: import('svelte').ComponentConstructorOptions<
			ReturnType<__sveltets_Render<Attributes>['props']>
		>,
	): import('svelte').SvelteComponent<
		ReturnType<__sveltets_Render<Attributes>['props']>,
		ReturnType<__sveltets_Render<Attributes>['events']>,
		ReturnType<__sveltets_Render<Attributes>['slots']>
	> & {
		$$bindings?: ReturnType<__sveltets_Render<Attributes>['bindings']>;
	} & ReturnType<__sveltets_Render<Attributes>['exports']>;
	<_Attributes extends Record<string, any>>(
		internal: unknown,
		props: {
			$$events?: ReturnType<__sveltets_Render<_Attributes>['events']>;
		},
	): ReturnType<__sveltets_Render<_Attributes>['exports']>;
	z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
export const Contentful: $$IsomorphicComponent;
