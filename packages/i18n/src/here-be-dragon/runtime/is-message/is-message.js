/**
 * @param {unknown} m
 * @returns {m is import('../types.public').Message}
 */
export function isMessage(m) {
	const anyM = /** @type {any} */ (m);
	return (
		typeof m === 'function' && '$t' in anyM && (anyM.$t === 'simple' || anyM.$t === 'with-params')
	);
}
