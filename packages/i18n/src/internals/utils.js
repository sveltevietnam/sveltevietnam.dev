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
 * @template {(v: unknown) => v is T} Predicate
 * @param {import('./private.d.ts').RecursiveRecord<T>} record
 * @param {Predicate} [predicate]
 * @returns {Record<string, T>}
 */
export function flattenRecursiveRecord(
	record,
	predicate = /** @type {Predicate} */ ((v) => typeof v !== 'object'),
) {
	/** @type {Record<string, T>} */
	const flat = {};

	for (const [key, value] of Object.entries(record)) {
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
 * @returns {void}
 */
export function printLintIssues(issueEntries) {
	if (issueEntries.length) {
		for (let i = 0; i < issueEntries.length; i++) {
			const [key, issues] = issueEntries[i];
			console.error(pico.red(`"${key}":`));
			for (const { message, e } of issues) {
				console.error(pico.red(`   - ${message + (e ? ` (${e})` : '')}`));
			}
		}
	}
}
