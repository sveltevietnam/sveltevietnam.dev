/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Snippet } from 'svelte';

import type { Language, Mode, Mapping } from '@sveltevietnam/i18n/generated';

import type { ContextInit } from '../../context';

/** context provider for i18n */
export type ProviderProps<
	Mo extends 'static' | 'remote' = Mode,
	L extends string = Language,
> = ContextInit<Mo, L, Mapping> & {
	children?: Snippet;
};

interface $$IsomorphicComponent {
	new <Mo extends 'static' | 'remote' = Mode, L extends string = Language>(
		options: import('svelte').ComponentConstructorOptions<ProviderProps<Mo, L>>,
	): import('svelte').SvelteComponent<ProviderProps<Mo, L>>;
	<Mo extends 'static' | 'remote' = Mode, L extends string = Language>(
		internal: unknown,
		props: ProviderProps<Mo, L>,
	): {};
	z_$$bindings?: '';
}
declare const Provider: $$IsomorphicComponent;
type Provider<Mo extends 'static' | 'remote' = Mode, L extends string = Language> = InstanceType<
	typeof Provider<Mo, L>
>;
export default Provider;
