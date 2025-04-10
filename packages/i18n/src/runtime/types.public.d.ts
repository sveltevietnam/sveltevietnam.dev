export type MessageType = 'string' | 'function' | 'snippet';

export type MessageString<P extends string = never> = string & {
	/** for internal use by `T.svelte` component */
	$t: 'string';
	/** DO NOT USE: for tying only, not available at runtime */
	$p: Record<P, string>;
};

export type MessageFunction<P extends string, F = (params: Record<P, string>) => string> = F & {
	/** for internal use by `T.svelte` component */
	$t: 'function';
	/** DO NOT USE: for tying only, not available at runtime */
	$p: Record<P, string>;
};

export type MessageSnippet<
	P extends string,
	S = import('svelte').Snippet<[params: Record<P, string>]>,
> = S & {
	/** for internal use by `T.svelte` component */
	$t: 'snippet';
	/** DO NOT USE: for tying only, not available at runtime */
	$p: Record<P, string>;
};

export type IntermediateMessage<P extends string> =
	| MessageString<P>
	| MessageFunction<P>
	| MessageSnippet<P>;

export interface Message<
	Type extends MessageType = MessageType,
	Params extends string = string,
	Langs extends string = string,
> {
	/** for internal use by `T.svelte` component and `isMessage` helper */
	$t: Type;
	(
		lang: Langs,
	): Type extends 'snippet'
		? MessageSnippet<Params>
		: Type extends 'function'
			? MessageFunction<Params>
			: MessageString<Params>;
}
