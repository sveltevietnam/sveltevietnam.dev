/**
 * @template {Record<string, import('../../runtime').Message>} MessageMap
 * @template {string} Language
 * @param {Record<string, () => Promise<unknown>>} modules - import.meta.glob to message modules
 * @returns {import(".").MessageQueryFn<MessageMap, Language>}
 */
export function createMessageQueryFn(modules) {
	return async function (inputs) {
		const langs = [...new Set(inputs.map((q) => q.lang))];
		/** @type {Record<Language, import('../types.private').MessageTargetMap<MessageMap, keyof MessageMap>>} */
		const messageMapPerLang = Object.fromEntries(
			await Promise.all(
				langs.map(async (lang) => {
					const mod = modules[`./messages/${lang}.js`];
					const messageMap =
						/** @type {import('../types.private').MessageTargetMap<MessageMap, keyof MessageMap>} */ (
							await mod()
						);
					return [lang, messageMap];
				}),
			),
		);

		return function (input) {
			return messageMapPerLang[input.lang][input.key](/** @type {any} */ (input).params || {});
		};
	};
}
