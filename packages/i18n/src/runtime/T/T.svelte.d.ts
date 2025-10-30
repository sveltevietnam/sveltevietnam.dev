/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Mode, Key } from '@sveltevietnam/i18n/generated';

import type { Message } from '../types.public';

import type { StaticTProps, RemoteTProps } from './types.public';

interface $$IsomorphicComponent {
	new <K extends Key, M extends Message>(
		options: import('svelte').ComponentConstructorOptions<
			Mode extends 'static' ? StaticTProps<M> : RemoteTProps<K>
		>,
	): import('svelte').SvelteComponent<Mode extends 'static' ? StaticTProps<M> : RemoteTProps<K>>;
	<K extends Key, M extends Message>(
		internal: unknown,
		props: Mode extends 'static' ? StaticTProps<M> : RemoteTProps<K>,
	): {};
	z_$$bindings?: '';
}
declare const T: $$IsomorphicComponent;
type T<K extends Key, M extends Message> = InstanceType<typeof T<K, M>>;
export default T;
