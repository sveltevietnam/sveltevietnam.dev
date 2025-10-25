/* eslint-disable @typescript-eslint/no-explicit-any */
export type MessageType = 'simple' | 'with-params';

export interface MessageSimple<Lang extends string, Key extends string> {
	/** denote that this is a MessageSimple */
	$t: 'simple';
	/** the locale key to this message **/
	$k: Key;

	/** DO NOT USE: tying only, not available at runtime */
	$$p: Record<never, string>;
	/** DO NOT USE: tying only, not available at runtime */
	$$l: Lang;

	/**
	 * call the message function to get the localized string
	 * @returns The localized, unsanitized string
	 */
	(lang: Lang): string;
}
export interface MessageWithParams<Lang extends string, Key extends string, Params extends string> {
	/** denote that this is a MessageWithParam */
	$t: 'with-params';
	/** the locale key to this message **/
	$k: Key;

	/** DO NOT USE: tying only, not available at runtime */
	$$p: Record<Params, string>;
	/** DO NOT USE: tying only, not available at runtime */
	$$l: Lang;

	/**
	 * Call the message with parameters to get the localized string
	 * @param params - The parameters for the message
	 * @returns The localized, unsanitized string
	 */
	(lang: Lang, params: Record<Params, string>): string;
}

export type Message<
	Lang extends string = any,
	Key extends string = any,
	Params extends string = any,
> = MessageSimple<Lang, Key> | MessageWithParams<Lang, Key, Params>;

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

export type RemoteTProps<
	K extends NonNullable<
		keyof ReturnType<import('@sveltevietnam/i18n-new/generated').$$Runtime>['mapping']
	>,
> = {
	/**
	 * key to the message to fetch, type of this key should
	 * be automatically augmented  via the generated `<output-dir>/i18n.d.ts` file
	 * after the vite plugin has run
	 */
	key: K;
	/** ad-hoc lang override, otherwise inherit from nearest `Provider` */
	lang?: ReturnType<import('@sveltevietnam/i18n-new/generated').$$Runtime>['languages'][number];
} & ReturnType<import('@sveltevietnam/i18n-new/generated').$$Runtime>['mapping'][K]['$$p'] &
	SharedTProps;
