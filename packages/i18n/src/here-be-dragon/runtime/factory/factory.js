/**
 * create a `MessageSimple` function, used by the internal compiler
 * @template {string} [Lang=string]
 * @template {string} [Key=string]
 * @param {Key} key
 * @param {(lang: Lang) => string} func
 * @returns {import('../types.public').MessageSimple<Lang, Key>}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function createMessageSimple(key, func) {
	[
		['$t', 'simple'],
		['$k', key],
	].forEach(([prop, value]) => {
		Object.assign(func, {
			...Object.defineProperty({}, prop, {
				value,
				writable: false,
				enumerable: true,
			}),
		});
	});
	return /** @type {import('../types.public').MessageSimple<Lang, Key>} */ (func);
}

/**
 * create a `MessageWithParams` function, used by the internal compiler
 * @template {string} [Lang=string]
 * @template {string} [Key=string]
 * @template {string} [Params=string]
 * @param {Key} key
 * @param {(lang: Lang, params: Record<Params, string>) => string} func
 * @returns {import('../types.public').MessageWithParams<Lang, Key, Params>}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function createMessageWithParams(key, func) {
	[
		['$t', 'with-params'],
		['$k', key],
	].forEach(([prop, value]) => {
		Object.assign(func, {
			...Object.defineProperty({}, prop, {
				value,
				writable: false,
				enumerable: true,
			}),
		});
	});
	return /** @type {import('../types.public').MessageWithParams<Lang, Key, Params>} */ (func);
}
