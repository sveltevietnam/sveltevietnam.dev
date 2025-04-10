import pico from 'picocolors';

/**
 * Check if a string contains HTML
 * @param {string} str - the input string to check
 * @returns {boolean} whether the input string contains HTML
 */
export function containsHtml(str) {
	return /<\/?[a-z][\s\S]*>/i.test(str);
}

/**
 * Check if a string is HTML
 * i.e. '<element>...</element>'
 * @param {string} str - the input string to check
 * @returns {boolean} whether the input string is HTML
 */
export function isHtml(str) {
	return /^<[a-z]+.*<\/[a-z]+>$/i.test(str) || /^<[a-z]+.*\/>$/i.test(str);
}

/**
 * @template T
 * @typedef FlattenRecursiveRecordOptions
 * @property {(v: unknown) => v is T} predicate - the predicate to use to check if the value is a primitive
 * @property {T} fallback - the fallback value to use when the value is null. Set to 'error' to throw an error when the value is null
 */

/**
 * @template T
 * @param {import('./private.d.ts').RecursiveRecord<T>} record - the input object to flatten
 * @param {Partial<FlattenRecursiveRecordOptions<T>>} [options]
 * @returns {Record<string, T>}
 */
export function flattenRecursiveRecord(record, options = {}) {
	const { predicate, fallback } = {
		predicate: /** @type {FlattenRecursiveRecordOptions<T>['predicate']} */ (
			(v) => typeof v !== 'object'
		),
		...options,
	};
	if (!record) {
		throw new Error(`Invalid input, expected a non-null object, got "${record}"`);
	}

	/** @type {Record<string, T>} */
	const flat = {};

	for (const [key, value] of Object.entries(record)) {
		if (!value) {
			if ('fallback' in options) {
				flat[key] = /** @type {T} */ (fallback);
				continue;
			} else {
				throw new Error(
					`Invalid input for key "${key}", expected a non-null object, got "${value}"`,
				);
			}
		}

		if (predicate(value)) {
			flat[key] = value;
		} else {
			const nested = flattenRecursiveRecord(value);
			for (const [nestedKey, nestedValue] of Object.entries(nested)) {
				flat[`${key}.${nestedKey}`] = nestedValue;
			}
		}
	}

	return flat;
}

/**
 * @param {[string, import('./lint.js').Issue[]][]} issueEntries - the list of lint issues per key, i.e [key, issues][]
 * @param {import('vite').Logger | typeof console} logger
 * @returns {void}
 */
export function printLintIssues(issueEntries, logger = console) {
	if (issueEntries.length) {
		for (let i = 0; i < issueEntries.length; i++) {
			const [key, issues] = issueEntries[i];
			logger.error(pico.red(`  "${key}":`));
			for (const { message, e } of issues) {
				logger.error(pico.red(`     - ${message + (e ? ` (${e})` : '')}`));
			}
		}
	}
}
