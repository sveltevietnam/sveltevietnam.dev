import { parseLocale, parseMessageParams } from './parse.js';

/**
 * @param {import('./private.d.ts').LocaleDirectoryMap} dirMap
 * @param {string[]} langs
 * @param {string} defaultLang
 * @param {boolean} [failFirst]
 * @returns {Promise<Record<string, string[]>>} list of lint error message per locale directory
 */
export async function lint(dirMap, langs, defaultLang, failFirst = false) {
	/** @type {Record<string, string[]>} */
	const errors = {};

	for (const [dirpath, locales] of dirMap.entries()) {
		/// 1 - check for missing locales
		const baseLocaleFilePath = locales[defaultLang];
		if (!baseLocaleFilePath) {
			if (!errors[dirpath]) errors[dirpath] = [];
			errors.dirpath.push(`missing default language "${defaultLang}.json"`);
			break;
		}

		const userLangs = Object.keys(locales);
		const missingLangs = Array.from(new Set(langs).difference(new Set(userLangs)));
		if (missingLangs.length) {
			if (!errors[dirpath]) errors[dirpath] = [];
			errors.dirpath.push(`missing "${missingLangs.map((l) => l + '.json').join(',')}"`);
			if (failFirst) break;
		}

		/// 2 - check for message inconsistency
		const baseLocale = await parseLocale(baseLocaleFilePath);
		const baseMessageKeySet = new Set(Object.keys(baseLocale.messages));

		for (const [lang, filepath] of Object.entries(locales).filter(
			([lang]) => lang !== defaultLang,
		)) {
			const locale = await parseLocale(filepath);

			/// 2.1 - check for missing messages
			const messageKeySet = new Set(Object.keys(locale.messages));
			const missingMessages = Array.from(baseMessageKeySet.difference(messageKeySet));
			if (missingMessages.length) {
				if (!errors[dirpath]) errors[dirpath] = [];
				for (const message of missingMessages) {
					errors[dirpath].push(
						`message "${message}" found in "${defaultLang}.json" but missing in "${lang}.json"`,
					);
				}
				if (failFirst) break;
			}

			/// 2.2 - check for inconsistent message parameters
			for (const key of baseMessageKeySet.values()) {
				if (!locale.messages[key]) continue;

				const baseParams = new Set(parseMessageParams(baseLocale.messages[key]).map((p) => p.name));
				const params = new Set(parseMessageParams(locale.messages[key]).map((p) => p.name));

				const inBaseButNotInLang = Array.from(baseParams.difference(params));
				if (inBaseButNotInLang.length) {
					if (!errors[dirpath]) errors[dirpath] = [];
					errors[dirpath].push(
						`message "${key}" in "${defaultLang}.json" has dynamic parameters "${inBaseButNotInLang.join(',')}" but missing in "${lang}.json"`,
					);
					if (failFirst) break;
				}

				const inLangButNotInBase = Array.from(params.difference(baseParams));
				if (inLangButNotInBase.length) {
					if (!errors[dirpath]) errors[dirpath] = [];
					errors[dirpath].push(
						`message "${key}" in "${lang}.json" has dynamic parameters "${inLangButNotInBase.join(',')}" but missing in "${defaultLang}.json"`,
					);
					if (failFirst) break;
				}
			}
		}
	}

	return errors;
}
