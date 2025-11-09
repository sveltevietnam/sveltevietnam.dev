import { Key, Mapping } from '@sveltevietnam/i18n/generated';

import type { TranslateOptions } from '../context/context/index.svelte';
import type { InferLanguage, InferParams, InferType, Message } from '../types.public';

/** props to `T` component in "static" mode */
export type StaticTProps<M extends Message> = {
	/**
	 * the message to render, typically imported from your generated i18n module,
	 * if the message is defined with parameters, pass them via the `params` prop
	 *
	 * @example
	 * ```svelte
	 * <script lang="ts">
	 *  import { T } from '@sveltevietnam/i18n';
	 *  import * as m from '@sveltevietnam/i18n/generated/messages';
	 * </script>
	 *
	 * <T message={m['key.to.simple.message']} />
	 * <T message={m['key.to.message.with.params']} foo="bar" />
	 * ```
	 */
	message: M;
} & Partial<TranslateOptions<'static', InferLanguage<M>, Mapping>> &
	(InferType<M> extends 'with-params'
		? {
				/**
				 * parameters to inject into message. You are seeing this because you have
				 * passed in a message field with `MessageWithParams` interface.
				 */
				params: InferParams<M>;
			}
		: Record<never, never>);

/** props to `T` component in "remote" mode */
export type RemoteTProps<K extends Key> = {
	/**
	 * key to the message to fetch, type of this key should key should be automatically augmented
	 * via the generated `<output-dir>/i18n.d.ts` file after the vite plugin has run
	 *
	 * @example
	 * ```svelte
	 * <script lang="ts">
	 *  import { T } from '@sveltevietnam/i18n';
	 * </script>
	 *
	 * <T key="key.to.simple.message" />
	 * <T key="key.to.message.with.params" foo="bar" />
	 * ```
	 */
	key: K;
} & Partial<TranslateOptions<'remote', InferLanguage<Mapping[K]>, Mapping>> &
	(InferType<Mapping[K]> extends 'with-params'
		? {
				/**
				 * parameters to inject into message. You are seeing this because you have
				 * passed in a key that refer to a message with `MessageWithParams` interface.
				 */
				params: InferParams<Mapping[K]>;
			}
		: Record<never, never>);
