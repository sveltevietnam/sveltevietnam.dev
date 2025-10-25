import type { Message, StaticTProps } from '..';

interface $$IsomorphicComponent {
	new <M extends Message>(
		options: import('svelte').ComponentConstructorOptions<StaticTProps<M>>,
	): import('svelte').SvelteComponent<StaticTProps<M>>;
}
declare const T: $$IsomorphicComponent;
type T<M extends Message> = InstanceType<typeof T<M>>;
export default T;
