/**
 * pack var as object with language properties
 * @example
 *
 * ```js
 * const translation = 'Hello';
 * assert(packLangVar(translation, ['en', 'vi']) === { en: 'Hello', vi: 'Hello' });
 * ```
 * @template {string} L
 * @template [V=string]
 * @param {V | Record<L, V>} v
 * @param {ReadonlyArray<L>} langs
 * @returns {Record<L, V>}
 */
export function packLangVar(v, langs) {
	if (
		typeof v === 'object' &&
		!Array.isArray(v) &&
		langs.every((l) => l in /** @type {Record<L, V>} */ (v))
	) {
		return /** @type {Record<L, V>} */ (v);
	}
	return langs.reduce((acc, l) => {
		acc[l] = /** @type {V} */ (v);
		return acc;
	}, /** @type {Record<L, V>} */ ({}));
}
