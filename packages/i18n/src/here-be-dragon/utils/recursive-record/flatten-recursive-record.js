// ===========
// Public API
// ===========
/**
 * @template T
 * @param {import('./types.public').RecursiveRecord<T>} record - the input object to flatten
 * @param {import('./types.public').FlattenRecursiveRecordOptions<T>} [options]
 * @returns {Record<string, T>}
 */
export function flattenRecursiveRecord(record, options = {}) {
	const {
		predicate = /** @type {(v: unknown) => v is T} */ (
			(v) => typeof v !== 'object' || Array.isArray(v)
		),
		fallback,
		rootKey = '',
	} = options;
	if (!record) {
		throw new ErrorMissingInput(`Invalid input, expected a non-null object, got "${record}"`);
	}

	/** @type {Record<string, T>} */
	const flat = {};

	for (const [key, value] of Object.entries(record)) {
		const rKey = buildKey(rootKey, key);
		if (!value) {
			if ('fallback' in options) {
				flat[rKey] = /** @type {T} */ (fallback);
				continue;
			} else {
				throw new ErrorMissingFieldWithNoFallback(
					`Invalid input for key "${rKey}", expected a non-null object, got "${value}"`,
				);
			}
		}

		if (predicate(value)) {
			flat[rKey] = value;
		} else {
			const nested = flattenRecursiveRecord(value, { predicate, fallback });
			for (const [nestedKey, nestedValue] of Object.entries(nested)) {
				const rKey = buildKey(rootKey, key, nestedKey);
				flat[rKey] = nestedValue;
			}
		}
	}

	return flat;
}

// =======
// Errors
// =======
export class FlatternRecursiveRecordError {
	/**
	 * @param {string} message
	 * @param {string} [name]
	 */
	constructor(message, name = 'FlatternRecursiveRecordError') {
		this.message = message;
		this.name = name;
	}
}

export const ErrorMissingInput = createError('FlatternRecursiveRecordErrorNullInput');
export const ErrorMissingFieldWithNoFallback = createError(
	'FlatternRecursiveRecordErrorMissingFieldWithNoFallback',
);

// ==========
// Internals
// ==========

/**
 * @param {string} root
 * @param {string[]} keys
 */
function buildKey(root, ...keys) {
	return keys.reduce((acc, key) => (acc ? `${acc}.${key}` : key), root);
}

/** @param {string} name */
function createError(name) {
	return class extends FlatternRecursiveRecordError {
		/** @param {string} message  */
		constructor(message) {
			super(message, name);
		}
	};
}
