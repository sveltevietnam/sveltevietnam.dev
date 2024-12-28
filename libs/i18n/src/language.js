export const LANGUAGES = /** @type {const} */ (['en', 'vi']);
/** @typedef {(typeof LANGUAGES)[number]} Language */

export const DEFAULT_LANGUAGE = /** @satisfies {Language}*/ ('en');

/**
 * @template {string} [L = Language]
 * @template [V = string]
 * @typedef { V | Record<L, V>} LangVar
 */

