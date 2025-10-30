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

/**
 * extract the union of key from a generated mapping that matches specific type of message
 *
 * @example
 * ```ts
 * import type { InferKey } from '@sveltevietnam/i18n';
 * import type { Mapping } from '@sveltevietnam/i18n/generated';
 *
 * type AllKey = InferKey<Mapping>;
 * type KeyForMessageSimple = InferKey<Mapping, 'simple'>;
 * type KeyForMessageWithParams = InferKey<Mapping, 'with-params'>;
 * ```
 */
export type InferKey<
	M extends Record<string, Message>,
	T extends MessageType = MessageType,
> = Extract<M[keyof M], { $t: T }>['$k'];
export type InferType<M extends Message> = M['$t'];
export type InferParams<M extends Message> = M['$$p'];
export type InferLanguage<M extends Message> = M['$$l'];
