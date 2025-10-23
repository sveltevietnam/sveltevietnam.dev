/**
 * create a `MessageSimple` function, used by the internal compiler
 * @template {string} [Lang=string]
 * @template {string} [Key=string]
 * @param {Key} key
 * @param {Record<Lang, () => string>} targets
 * @returns {import('../types.public').MessageSimple<Lang, Key>}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function createMessageSimple(key, targets) {
	const translate = /** @type {(lang: Lang) => string} */ ((lang) => targets[lang]());
	[
		['$t', 'simple'],
		['$k', key],
	].forEach(([prop, value]) => {
		Object.assign(translate, {
			...Object.defineProperty({}, prop, {
				value,
				writable: false,
				enumerable: true,
			}),
		});
	});
	return /** @type {import('../types.public').MessageSimple<Lang, Key>} */ (translate);
}

/**
 * create a `MessageWithParams` function, used by the internal compiler
 * @template {string} [Lang=string]
 * @template {string} [Key=string]
 * @template {string} [Params=string]
 * @param {Key} key
 * @param {Record<Lang, (params: Record<Params, string>) => string>} targets
 * @returns {import('../types.public').MessageWithParams<Lang, Key, Params>}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function createMessageWithParams(key, targets) {
	const translate = /** @type {(lang: Lang, params: Record<Params, string>) => string} */ (
		(lang, params) => targets[lang](params)
	);
	[
		['$t', 'with-params'],
		['$k', key],
	].forEach(([prop, value]) => {
		Object.assign(translate, {
			...Object.defineProperty({}, prop, {
				value,
				writable: false,
				enumerable: true,
			}),
		});
	});
	return /** @type {import('../types.public').MessageWithParams<Lang, Key, Params>} */ (translate);
}
