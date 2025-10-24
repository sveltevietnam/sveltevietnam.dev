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
	Lang extends string = string,
	Key extends string = string,
	Params extends string = string,
> = MessageSimple<Lang, Key> | MessageWithParams<Lang, Key, Params>;
