/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Message } from '../types.public';

import type { StaticTProps } from './types.public';

interface $$IsomorphicComponent {
	new <M extends Message>(
		options: import('svelte').ComponentConstructorOptions<StaticTProps<M>>,
	): import('svelte').SvelteComponent<StaticTProps<M>>;
	<M extends Message>(internal: unknown, props: StaticTProps<M>): {};
	z_$$bindings?: '';
}
declare const StaticT: $$IsomorphicComponent;
type StaticT<M extends Message> = InstanceType<typeof StaticT<M>>;
export default StaticT;
