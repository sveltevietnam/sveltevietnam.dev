import type { $$Runtime } from '@sveltevietnam/i18n-new/generated';

import type { Message } from '../types.public';

import type { StaticTProps, RemoteTProps } from '.';

interface $$IsomorphicComponent {
	new <K extends keyof ReturnType<$$Runtime>['mapping'], M extends Message>(
		options: import('svelte').ComponentConstructorOptions<
			ReturnType<$$Runtime>['mode'] extends 'static' ? StaticTProps<M> : RemoteTProps<K>
		>,
	): import('svelte').SvelteComponent<
		ReturnType<$$Runtime>['mode'] extends 'static' ? StaticTProps<M> : RemoteTProps<K>
	>;
}
declare const T: $$IsomorphicComponent;
type T<K extends keyof ReturnType<$$Runtime>['mapping'], M extends Message> = InstanceType<
	typeof T<K, M>
>;
export default T;
