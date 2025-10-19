export const LANGUAGES = /** @type {const} */ (['en', 'vi']);
/** @typedef {(typeof LANGUAGES)[number]} Language */

export const DEFAULT_LANGUAGE = /** @satisfies {Language}*/ ('en');
