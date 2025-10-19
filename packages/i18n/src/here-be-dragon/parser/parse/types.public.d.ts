export interface ParseOptions {
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
	/** custom directive key */
	directive?: {
		/** @default `'@import'` */
		import?: string;
	};
}
