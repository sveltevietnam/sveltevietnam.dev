/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { InferParams, InferType } from '@sveltevietnam/i18n-new';
import type { Key, Mapping } from '@sveltevietnam/i18n-new/generated';
import type { Snippet } from 'svelte';

interface SnippetProp {
	snippet: Snippet<[any]>;
	params?: any;
}

interface ExtendedHTMLProp<A extends Record<string, any>, K extends Key = Key> {
	content: string | TProp<K>;
	attributes?: A;
}

type TProp<K extends Key> = {
	key: K;
} & (InferType<Mapping[K]> extends 'with-params'
	? { params: InferParams<Mapping[K]> }
	: Record<never, never>);

export type ContentfulProps<A extends Record<string, any>, K extends Key = Key> = {
	content: string | ['snippet', SnippetProp] | ['html', ExtendedHTMLProp<A>] | ['t', TProp<K>];
	tag: keyof HTMLElementTagNameMap;
} & A;

/// mimic output of svelte-package to support generics

declare class __sveltets_Render<A extends Record<string, any>, K extends Key = Key> {
	props(): ContentfulProps<A, K>;
	events(): {} & {
		[evt: string]: CustomEvent<any>;
	};
	slots(): {};
	bindings(): string;
	exports(): {};
}

interface $$IsomorphicComponent {
	new <A extends Record<string, any>, K extends Key = Key>(
		options: import('svelte').ComponentConstructorOptions<ContentfulProps<A, K>>,
	): import('svelte').SvelteComponent<ContentfulProps<A, K>>;
	<A extends Record<string, any>, K extends Key = Key>(
		internal: unknown,
		props: ContentfulProps<A, K>,
	): {};
	z_$$bindings?: '';
}
export const Contentful: $$IsomorphicComponent;
