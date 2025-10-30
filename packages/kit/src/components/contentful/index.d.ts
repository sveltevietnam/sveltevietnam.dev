/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { KeySimple } from '@sveltevietnam/i18n/generated';
import type { Snippet } from 'svelte';

interface SnippetProp {
	snippet: Snippet<[any]>;
	params?: any;
}

interface ExtendedHTMLProp<A extends Record<string, any>> {
	content: string | ['t', KeySimple];
	attributes?: A;
}

export type ContentfulProps<A extends Record<string, any>> = {
	content: string | ['snippet', SnippetProp] | ['extend', ExtendedHTMLProp<A>] | ['t', KeySimple];
	tag: keyof HTMLElementTagNameMap;
} & A;

/// mimic output of svelte-package to support generics

declare class __sveltets_Render<A extends Record<string, any>> {
	props(): ContentfulProps<A>;
	events(): {} & {
		[evt: string]: CustomEvent<any>;
	};
	slots(): {};
	bindings(): string;
	exports(): {};
}

interface $$IsomorphicComponent {
	new <A extends Record<string, any>>(
		options: import('svelte').ComponentConstructorOptions<ContentfulProps<A>>,
	): import('svelte').SvelteComponent<ContentfulProps<A>>;
	<A extends Record<string, any>>(internal: unknown, props: ContentfulProps<A>): {};
	z_$$bindings?: '';
}
export const Contentful: $$IsomorphicComponent;
