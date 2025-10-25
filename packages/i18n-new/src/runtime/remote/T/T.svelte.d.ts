import type { RemoteTProps } from '../..';

interface $$IsomorphicComponent {
	new <
		K extends keyof ReturnType<import('@sveltevietnam/i18n-new/generated').$$Runtime>['mapping'],
	>(
		options: import('svelte').ComponentConstructorOptions<RemoteTProps<K>>,
	): import('svelte').SvelteComponent<RemoteTProps<K>>;
}
declare const T: $$IsomorphicComponent;
type T<
	K extends keyof ReturnType<import('@sveltevietnam/i18n-new/generated').$$Runtime>['mapping'],
> = InstanceType<typeof T<K>>;
export default T;
