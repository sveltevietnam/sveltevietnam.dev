/**
 * @template {string} L
 * @template {string} K
 * @template {string} P
 * @overload
 * @param {import('.').MessageWithParams<L, K, P>} message
 * @param {L} lang
 * @param {P} params
 * @returns {string}
 */
/**
 * @template {string} L
 * @template {string} K
 * @template {string} P
 * @overload
 * @param {import('.').MessageWithParams<L, K, P>} message
 * @param {L} lang
 * @returns {string}
 */
/**
 * @template {string} L
 * @template {string} K
 * @template {string} P
 * @param {import('.').Message<L, K, P>} message
 * @param {L} lang
 * @param {P} [params]
 * @returns {string}
 */
export function t(message, lang, params) {
	return message(lang, /** @type {any} */ (params));
}
