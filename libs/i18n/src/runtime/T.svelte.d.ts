/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

declare class __sveltets_Render<Params extends string> {
    props(): Record<Params, string> & {
        message: import('./types.public.js').Message<Params>;
    };
    events(): {};
    slots(): {};
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <Params extends string>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<Params>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<Params>['props']>, ReturnType<__sveltets_Render<Params>['events']>, ReturnType<__sveltets_Render<Params>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<Params>['bindings']>;
    } & ReturnType<__sveltets_Render<Params>['exports']>;
    <Params extends string>(internal: unknown, props: ReturnType<__sveltets_Render<Params>['props']> & {}): ReturnType<__sveltets_Render<Params>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const T: $$IsomorphicComponent;
type T<Params extends string = never> = InstanceType<typeof T<Params>>;
export default T;

