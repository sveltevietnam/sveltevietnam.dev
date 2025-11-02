/**
 * @template {Record<string, import('../../runtime').Message>} MessageMap
 * @template {string} Language
 * @param {Record<string, () => Promise<unknown>>} modules - import.meta.glob to message modules
 * @returns {import(".").MessagePrerenderFn<MessageMap, Language>}
 */
export function createMessagePrerenderFn(modules) {
	return async function (input) {
		const mod = modules[`./messages/${input.lang}.js`];
		const messageMap =
			/** @type {import('../types.private').MessageTargetMap<MessageMap, keyof MessageMap>} */ (
				await mod()
			);
		return messageMap[input.key](/** @type {any} */ (input).params || {});
	};
}
