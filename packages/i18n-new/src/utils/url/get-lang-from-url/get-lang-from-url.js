import { isUrlLocalized } from '../is-url-localized/is-url-localized.js';

/**
 * @template {string} L
 * @template {L | undefined} F
 * @template [R=undefined extends F ? (L | null) : L]
 * @param {string | URL} url
 * @param {ReadonlyArray<L>} langs
 * @param {F} [fallback]
 * @returns {R}
 */
export function getLangFromUrl(url, langs, fallback = undefined) {
	const found = langs.find((l) => isUrlLocalized(url, l)) ?? null;
	if (fallback === undefined) {
		return /** @type {any} */ (found);
	}
	return /** @type {any} */ (found ?? fallback);
}
