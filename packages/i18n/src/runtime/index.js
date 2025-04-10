export * from './types.public.js';

/**
 * @param {string} content
 * @returns {import('./types.public.js').MessageString}
 */
export function createMessageString(content) {
	return /** @type {import('./types.public.js').MessageString} */ (
		Object.assign(content, {
			...Object.defineProperty({}, '$t', {
				value: 'string',
				writable: false,
				enumerable: true,
			}),
		})
	);
}

/**
 * @template {string} [P=never]
 * @param {(params: Record<P, string>) => string} func
 * @returns {import('./types.public.js').MessageFunction<P>}
 */
export function createMessageFunction(func) {
	return /** @type {import('./types.public.js').MessageFunction<P>} */ (
		Object.assign(func, {
			...Object.defineProperty({}, '$t', {
				value: 'function',
				writable: false,
				enumerable: true,
			}),
		})
	);
}

/**
 * @template {string} [P=never]
 * @param {import('svelte').Snippet<[Record<P, string>]>} snippet
 * @returns {import('./types.public.js').MessageSnippet<P>}
 */
export function createMessageSnippet(snippet) {
	return /** @type {import('./types.public.js').MessageSnippet<P>} */ (
		Object.assign(snippet, {
			...Object.defineProperty({}, '$t', {
				value: 'snippet',
				writable: false,
				enumerable: true,
			}),
		})
	);
}

/**
 * @template {Record<string, import('./types.public.js').IntermediateMessage<string>>} M
 * @param {M} messages
 * @returns {import('./types.public.js').Message<M[keyof M]['$t'], keyof M[keyof M]['$p']>}
 */
export function createMessage(messages) {
	const resolver = /** @type {any} */ (
		/** @param {string} lang */
		(lang) => messages[lang]
	);
	resolver.$$i18n = true;
	return resolver;
}

/**
 * @param {unknown} m
 * @returns {m is import('./types.public.js').Message}
 */
export function isMessage(m) {
	return '$t' in /** @type {any} */ (m);
}
