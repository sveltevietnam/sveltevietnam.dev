/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { Message } from '../types.public';

export type MessageProps<M extends Message> = {
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
	message: M;
	/**
	 * customize how message content is sanitized before rendering
	 * if not provided, will inherit from the nearest `Provider` in the component tree,
	 * otherwise, default to `sanitize-html` package
	 */
	sanitize?: (content: string) => string;
	lang?: M['$$l'];
} & M['$$p'];

declare class __sveltets_Render<M extends Message> {
	props(): MessageProps<M>;
	events(): {};
	slots(): {};
	bindings(): '';
	exports(): {};
}
interface $$IsomorphicComponent {
	new <M extends Message>(
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
	<M extends Message>(
		internal: unknown,
		props: ReturnType<__sveltets_Render<M>['props']> & {},
	): ReturnType<__sveltets_Render<M>['exports']>;
	z_$$bindings?: ReturnType<__sveltets_Render<Message>['bindings']>;
}
declare const T: $$IsomorphicComponent;
type T<M extends Message> = InstanceType<typeof T<M>>;
export default T;
