/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

declare class __sveltets_Render<P extends string> {
	props(): {
		message: (lang: string) => import('./types.public.js').Message<P>;
		lang?: string;
	} & Record<P, string>;
	events(): {};
	slots(): {};
	bindings(): '';
	exports(): {};
}
interface $$IsomorphicComponent {
	new <P extends string>(
		options: import('svelte').ComponentConstructorOptions<
			ReturnType<__sveltets_Render<P>['props']>
		>,
	): import('svelte').SvelteComponent<
		ReturnType<__sveltets_Render<P>['props']>,
		ReturnType<__sveltets_Render<P>['events']>,
		ReturnType<__sveltets_Render<P>['slots']>
	> & {
		$$bindings?: ReturnType<__sveltets_Render<P>['bindings']>;
	} & ReturnType<__sveltets_Render<P>['exports']>;
	<P extends string>(
		internal: unknown,
		props: ReturnType<__sveltets_Render<P>['props']> & {},
	): ReturnType<__sveltets_Render<P>['exports']>;
	z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const T: $$IsomorphicComponent;
type T<P extends string> = InstanceType<typeof T<P>>;
export default T;
