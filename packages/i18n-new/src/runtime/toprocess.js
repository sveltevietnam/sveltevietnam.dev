/**
 * @template {I18N.MessageSimpleKey} Key
 * @overload
 * @param {Key} key
 * @returns {string}
 */
/**
 * @template {I18N.MessageWithParamsKey} Key
 * @overload
 * @param {Key} key
 * @param {Record<I18N.MessageMap[Key]['$p'], string>} params
 * @returns {string}
 */
/**
 * translate a message
 * @template {I18N.MessageKey} Key
 * @param {Key} key
 * @param {Record<string, string>} params
 * @returns {string}
 */
export function toprocess(key, params) {
	console.log('Unprocessed translate function called:', { key, params });
	throw new Error(
		'Unprocessed translate function. This should have been replaced by the @sveltevietnam/i18n vite plugin. Please see github.com/sveltevietnam/sveltevietnam.dev/tree/main/packages/i18n for more information',
	);
}
