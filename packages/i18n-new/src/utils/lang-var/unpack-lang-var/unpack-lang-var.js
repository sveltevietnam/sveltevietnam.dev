/**
 * unpack target language property of var
 * @example
 *
 * ```js
 * const translation = {
 *  en: 'Hello',
 *  vi: 'Xin chào',
 * };
 *
 * assert(localizeLangVar(translation, 'en') === 'Hello');
 * assert(localizeLangVar(translation, 'vi') === 'Xin chào');
 * ```
 * @template {string} L
 * @template V
 * @param {V | Record<L, V>} v
 * @param {L} lang
 * @returns {V}
 */
export function unpackLangVar(v, lang) {
	if (!v) return v;

	if (typeof v === 'object' && !Array.isArray(v)) {
		if (!(lang in v)) throw new Error(`Missing language variant "${lang}" in ${JSON.stringify(v)}`);
		return /** @type {Record<L, V>} */ (v)[lang];
	}

	return /** @type {V} */ (v);
}
