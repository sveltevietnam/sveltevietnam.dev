import type { MessageParameter } from '../parse-message-params/types.public';

export interface ParseLocaleOptions {
	/**
	 * custom deserializer that transforms the locale source
	 * file UTF-8 content into Javascript object.
	 * @defaults `import('yaml')`
	 */
	deserializer?: {
		parse: (input: { file: string; content: string }) => Promise<object> | object;
	};
	/** root key to prefix all message keys */
	rootKey?: string;
	/** customize import behavior */
	import?: {
		/** @default `'@import'` */
		directive?: string;
		alias?: {
			find: string | RegExp;
			replacement: string;
		}[];
	};
}

export interface SourceMessage {
	key: string;
	/** final message content after any merging */
	content: string;
	/**
	 * where this message was found in
	 * before merging into the final output
	 */
	sources: { file: string; content: string }[];
	/** array of parsed parameter info */
	params: MessageParameter[];
}

export interface ParseLocaleOutput {
	/** collected message flat mapped by key */
	messages: SourceMessage[];
	/** the locale files that were imported along the way */
	dependencies: Set<string>;
}
