export type MessageType = 'simple' | 'with-param';

export interface MessageSimple<Key extends string> {
	/** DO NOT USE: denote that this is a MessageSimple */
	$t: 'simple';
	/** DO NOT USE: the locale key to this message **/
	$k: Key;
	/** DO NOT USE: tying only, not available at runtime */
	$p: Record<never, string>;

	/**
	 * Call the message with language to get the localized string
	 * @returns The localized, unsanitized string
	 */
	(): string;
}
export interface MessageWithParams<Key extends string, Params extends string> {
	/** DO NOT USE: denote that this is a MessageWithParam */
	$t: 'with-params';
	/** DO NOT USE: the locale key to this message **/
	$k: Key;
	/** DO NOT USE: tying only, not available at runtime */
	$p: Record<Params, string>;

	/**
	 * Call the message with language and parameters to get the localized string
	 * @param params - The parameters for the message
	 * @returns The localized, unsanitized string
	 */
	(params: Record<Params, string>): string;
}

export type Message<Key extends string, Params extends string = never> =
	| MessageSimple<Key>
	| MessageWithParams<Key, Params>;
