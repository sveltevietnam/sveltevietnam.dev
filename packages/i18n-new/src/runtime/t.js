/**
 * @param {string} key
 * @param {Record<string, string>} params
 * @returns {string}
 */
export function t(key, params) {
	console.log('Unprocessed translate function called:', { key, params });
	throw new Error(
		'Unprocessed translate function. This should have been replaced by the @sveltevietnam/i18n vite plugin. Please see github.com/sveltevietnam/sveltevietnam.dev/tree/main/packages/i18n for more information',
	);
}
