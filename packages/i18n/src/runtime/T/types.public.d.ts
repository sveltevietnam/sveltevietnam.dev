import { Key, Mapping } from '@sveltevietnam/i18n/generated';

import type { InferLanguage, InferParams, InferType, Message } from '../types.public';

export type SharedTProps = {
	/**
	 * customize how message content is sanitized before rendering
	 * if not provided, will inherit from the nearest `Provider` in the component tree,
	 * otherwise, default to `sanitize-html` package
	 */
	sanitize?: (content: string) => string;
};

export type StaticTProps<M extends Message> = SharedTProps & {
	/**
	 * the message to render, typically imported from your generated i18n module,
	 * if the message is defined with parameters, pass them via the `params` prop
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
	/** ad-hoc lang override, otherwise inherit from nearest `Provider` */
	lang?: InferLanguage<M>;
} & (InferType<M> extends 'with-params' ? { params: InferParams<M> } : Record<never, never>);

export type RemoteTProps<K extends Key> = SharedTProps & {
	/**
	 * key to the message to fetch, type of this key should
	 * be automatically augmented  via the generated `<output-dir>/i18n.d.ts` file
	 * after the vite plugin has run
	 *
	 * if the message is defined with parameters, pass them via the `params` prop
	 */
	key: K;
	/** ad-hoc lang override, otherwise inherit from nearest `Provider` */
	lang?: InferLanguage<Mapping[K]>;
} & (InferType<Mapping[K]> extends 'with-params'
		? { params: InferParams<Mapping[K]> }
		: Record<never, never>);
