/**
 * create a `MessageSimple` function, used by the internal compiler
 * @template {string} [Key=string]
 * @param {Key} key
 * @param {() => string} func
 * @returns {import('../types.public').MessageSimple<Key>}
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
	return /** @type {import('../types.public').MessageSimple<Key>} */ (func);
}

/**
 * create a `MessageWithParams` function, used by the internal compiler
 * @template {string} [Key=string]
 * @template {string} [Params=string]
 * @param {Key} key
 * @param {(params: Record<Params, string>) => string} func
 * @returns {import('../types.public').MessageWithParams<Key, Params>}
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
	return /** @type {import('../types.public').MessageWithParams<Key, Params>} */ (func);
}
