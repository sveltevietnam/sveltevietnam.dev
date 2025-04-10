/* eslint-disable @typescript-eslint/no-empty-object-type */

declare class __sveltets_Render<M extends import('./types.public.js').Message> {
	props(): {
		message: M;
		lang?: string;
	} & Record<keyof ReturnType<M>['$p'], string>;
	events(): {};
	slots(): {};
	bindings(): '';
	exports(): {};
}
interface $$IsomorphicComponent {
	new <M extends import('./types.public.js').Message>(
		options: import('svelte').ComponentConstructorOptions<
			ReturnType<__sveltets_Render<M>['props']>
		>,
	): import('svelte').SvelteComponent<
		ReturnType<__sveltets_Render<M>['props']>,
		ReturnType<__sveltets_Render<M>['events']>,
		ReturnType<__sveltets_Render<M>['slots']>
	> & {
		$$bindings?: ReturnType<__sveltets_Render<M>['bindings']>;
	} & ReturnType<__sveltets_Render<M>['exports']>;
	<M extends import('./types.public.js').Message>(
		internal: unknown,
		props: ReturnType<__sveltets_Render<M>['props']> & {},
	): ReturnType<__sveltets_Render<M>['exports']>;
	z_$$bindings?: ReturnType<__sveltets_Render<import('./types.public.js').Message>['bindings']>;
}
declare const T: $$IsomorphicComponent;
type T<M extends import('./types.public.js').Message> = InstanceType<typeof T<M>>;
export default T;
