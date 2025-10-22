/**
 * @template {string} Key
 * @template {string} Lang
 * @template {string} Params
 * @overload
 * @param {import("../types.public").MessageWithParams<Key, Params>} message
 * @param {Record<Params, string>} params
 * @returns {string}
 */
/**
 * @template {string} Key
 * @overload
 * @param {import("../types.public").MessageSimple<Key>} message
 * @returns {string}
 */
/**
 * @template {string} Key
 * @template {string} Params
 * @param {import("../types.public").Message<Key, Params>} message
 * @param {Record<Params, string>} [params]
 * @returns {string}
 */
export function translate(message, params) {
	return message(/** @type {Record<Params, string>} */ (params));
}
