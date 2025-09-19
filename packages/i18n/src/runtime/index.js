export * from './types.public.js';
export { default as T } from './T.svelte';

/**
 * @param {unknown} m
 * @returns {m is import('./types.public.js').Message}
 */
export function isMessage(m) {
	if (typeof m === 'string') return false;
	return '$t' in /** @type {any} */ (m);
}
