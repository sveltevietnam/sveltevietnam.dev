/**
 * wraps a schema.org Thing with the context.
 * @template {import('schema-dts').Thing} T
 * @param {T} data
 */
export function withContext(data) {
	return {
		'@context': 'https://schema.org',
		.../** @type {any} */ (data),
	};
}

/**
 * Converts a schema.org Thing or an array of Things to a JSON string with context.
 * @template {import('schema-dts').Thing} T
 * @param {T | T[]} data - The schema.org Thing or array of Things to convert.
 * @return {string}
 */
export function toStringWithContext(data) {
	if (Array.isArray(data)) {
		return JSON.stringify(data.map(withContext));
	}
	return JSON.stringify(withContext(data));
}

/**
 * Builds a structured language-aware text object
 * @param {{ lang: string; value: string }} text - the text object
 * @returns {any}
 */
export function buildStructuredTextWithLang(text) {
	return {
		'@language': text.lang,
		'@value': text.value,
	};
}
