export type MessageType = 'simple' | 'with-params';

export interface MessageSimple<Lang extends string, Key extends string> {
	/** DO NOT USE: denote that this is a MessageSimple */
	$t: 'simple';
	/** DO NOT USE: the locale key to this message **/
	$k: Key;
	/** DO NOT USE: tying only, not available at runtime */
	$p: Record<never, string>;

	/**
	 * call the message function to get the localized string
	 * @returns The localized, unsanitized string
	 */
	(lang: Lang): string;
}
export interface MessageWithParams<Lang extends string, Key extends string, Params extends string> {
	/** DO NOT USE: denote that this is a MessageWithParam */
	$t: 'with-params';
	/** DO NOT USE: the locale key to this message **/
	$k: Key;
	/** DO NOT USE: tying only, not available at runtime */
	$p: Record<Params, string>;

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
