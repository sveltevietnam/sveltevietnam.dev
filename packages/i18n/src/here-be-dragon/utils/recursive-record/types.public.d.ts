export type FlattenRecursiveRecordOptions<T> = {
	/**
	 * a check to determine if the value is a primitive (keep) or a nested record (recurse)
	 * @default to `(v) => typeof v !== 'object' || Array.isArray(v)`
	 */
	predicate?: (value: unknown) => value is T;
	/**
	 * optional root key to prefix when flattening
	 */
	rootKey?: string;
	/**
	 * value to use when value is null, otherwise throw error
	 */
	fallback?: T;
};

export type RecursiveRecord<T> = {
	[key: string]: T | RecursiveRecord<T>;
};
