export const LANGUAGES = /** @type {const} */ (['en', 'vi']);
/** @typedef {(typeof LANGUAGES)[number]} Language */

export const DEFAULT_LANGUAGE = /** @satisfies {Language}*/ ('en');

/**
 * @template [T = string]
 * @typedef { T | Record<Language, T>} LangVar
 */

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
 * assert(localizeLangVar('en', translation) === 'Hello');
 * assert(localizeLangVar('vi', translation) === 'Xin chào');
 * ```
 * @template T
 * @param {Language} lang
 * @param {LangVar<T>} [v]
 * @returns {T}
 */
export function localizeLangVar(lang, v) {
	if (
		typeof v === 'object' &&
		!Array.isArray(v) &&
		LANGUAGES.some((l) => l in /** @type {Record<Language, T>} */ (v))
	) {
		const r = /** @type {Record<Language, T>} */ (v)[lang] ?? null;
		if (r === null) throw new Error(`Missing language variant "${lang}" in ${JSON.stringify(v)}`);
		return r;
	}
	return /** @type {T} */ (v);
}

/**
 * pack var as object with language properties
 * @example
 *
 * ```js
 * const translation = 'Hello';
 * assert(delocalizeLangVar(translation) === { en: 'Hello', vi: 'Hello' });
 * ```
 * @template T
 * @param {LangVar<T>} v
 * @returns {Record<Language, T>}
 */
export function delocalizeLangVar(v) {
	if (
		typeof v === 'object' &&
		!Array.isArray(v) &&
		LANGUAGES.every((l) => l in /** @type {Record<Language, T>} */ (v))
	) {
		return /** @type {Record<Language, T>} */ (v);
	}
	return LANGUAGES.reduce((acc, l) => {
		acc[l] = /** @type {T} */ (v);
		return acc;
	}, /** @type {Record<Language, T>} */ ({}));
}
