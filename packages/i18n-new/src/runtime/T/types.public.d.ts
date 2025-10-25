import type { $$Runtime } from '@sveltevietnam/i18n-new/generated';

import type { Message } from '../types.public';

export type SharedTProps = {
	/**
	 * customize how message content is sanitized before rendering
	 * if not provided, will inherit from the nearest `Provider` in the component tree,
	 * otherwise, default to `sanitize-html` package
	 */
	sanitize?: (content: string) => string;
};

export type StaticTProps<M extends Message> = {
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
	/** ad-hoc lang override, otherwise inherit from nearest `Provider` */
	lang?: M['$$l'];
} & M['$$p'] &
	SharedTProps;

export type RemoteTProps<K extends NonNullable<keyof ReturnType<$$Runtime>['mapping']>> = {
	/**
	 * key to the message to fetch, type of this key should
	 * be automatically augmented  via the generated `<output-dir>/i18n.d.ts` file
	 * after the vite plugin has run
	 */
	key: K;
	/** ad-hoc lang override, otherwise inherit from nearest `Provider` */
	lang?: ReturnType<$$Runtime>['languages'][number];
} & ReturnType<$$Runtime>['mapping'][K]['$$p'] &
	SharedTProps;
