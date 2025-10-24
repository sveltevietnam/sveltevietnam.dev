/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { Message } from '../types.public';

export type MessageProps<L extends string, K extends string, P extends string> = {
	/**
	 * the message to render, typically imported from your generated i18n module,
	 * if the message is defined with parameters, pass them as additional props
	 *
	 * @example
	 * ```svelte
	 * <script lang="ts">
	 *  import * as m from '$i18n/messages';
	 * </script>
	 *
	 * <T message={m['key.to.simple.message']} />
	 *
	 * <T message={m['key.to.message.with.params']} foo="bar" />
	 * ```
	 */
	message: Message<L, K, P>;
	/**
	 * customize how message content is sanitized before rendering
	 * if not provided, will inherit from the nearest `Provider` in the component tree,
	 * otherwise, default to `sanitize-html` package
	 */
	sanitize?: (content: string) => string;
	lang?: L;
} & Record<P, string>;

declare class __sveltets_Render<L extends string, K extends string, P extends string> {
	props(): MessageProps<L, K, P>;
	events(): {};
	slots(): {};
	bindings(): '';
	exports(): {};
}
interface $$IsomorphicComponent {
	new <L extends string, K extends string, P extends string>(
		options: import('svelte').ComponentConstructorOptions<
			ReturnType<__sveltets_Render<L, K, P>['props']>
		>,
	): import('svelte').SvelteComponent<
		ReturnType<__sveltets_Render<L, K, P>['props']>,
		ReturnType<__sveltets_Render<L, K, P>['events']>,
		ReturnType<__sveltets_Render<L, K, P>['slots']>
	> & {
		$$bindings?: ReturnType<__sveltets_Render<L, K, P>['bindings']>;
	} & ReturnType<__sveltets_Render<L, K, P>['exports']>;
	<L extends string, K extends string, P extends string>(
		internal: unknown,
		props: ReturnType<__sveltets_Render<L, K, P>['props']> & {},
	): ReturnType<__sveltets_Render<L, K, P>['exports']>;
	z_$$bindings?: ReturnType<__sveltets_Render<string, string, string>['bindings']>;
}
declare const T: $$IsomorphicComponent;
type T<L extends string, K extends string, P extends string> = InstanceType<typeof T<L, K, P>>;
export default T;
