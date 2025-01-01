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

	await Promise.all(
		dirMap.entries().map(async ([dirpath, locales]) => {
			/// 1 - check for missing locales
			const baseLocaleFilePath = locales[defaultLang];
			if (!baseLocaleFilePath) {
				if (!errors[dirpath]) errors[dirpath] = [];
				errors.dirpath.push(`missing default language "${defaultLang}.json"`);
				return;
			}

			const userLangs = Object.keys(locales);
			const missingLangs = Array.from(new Set(langs).difference(new Set(userLangs)));
			if (missingLangs.length) {
				if (!errors[dirpath]) errors[dirpath] = [];
				errors.dirpath.push(`missing "${missingLangs.map((l) => l + '.json').join(',')}"`);
				if (failFirst) return;
			}

			/// 2 - check for message inconsistency
			/** @type {import('./private.d.ts').Locale} */
			let baseLocale;
			try {
				baseLocale = await parseLocale(baseLocaleFilePath);
			} catch (e) {
				if (!errors[dirpath]) errors[dirpath] = [];
				errors[dirpath].push(
					`failed to parse "${defaultLang}.json" - see error above and make sure your JSON is correctly formatted.`,
				);
				console.error(e);
				return;
			}
			const baseMessageKeySet = new Set(Object.keys(baseLocale.messages));

			for (const [lang, filepath] of Object.entries(locales).filter(
				([lang]) => lang !== defaultLang,
			)) {
				/** @type {import('./private.d.ts').Locale} */
				let locale;
				try {
					locale = await parseLocale(filepath);
				} catch (e) {
					if (!errors[dirpath]) errors[dirpath] = [];
					errors[dirpath].push(
						`failed to parse "${lang}.json" - see error above and make sure your JSON is correctly formatted.`,
					);
					console.error(e);
					return;
				}

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
					if (failFirst) return;
				}

				/// 2.2 - check for inconsistent message parameters
				for (const key of baseMessageKeySet.values()) {
					if (!locale.messages[key]) continue;

					/** @type {Set<string>} */
					let baseParams;
					try {
						baseParams = new Set(parseMessageParams(baseLocale.messages[key]).map((p) => p.name));
					} catch (e) {
						if (!errors[dirpath]) errors[dirpath] = [];
						errors[dirpath].push(
							`failed to parse dynamic parameters of message "${key}" in "${defaultLang}.json" - see error above and make sure your param is correctly wrapped in double curly brackets, i.e {{ ... }}.`,
						);
						console.error(e);
						return;
					}

					/** @type {Set<string>} */
					let params;
					try {
						params = new Set(parseMessageParams(locale.messages[key]).map((p) => p.name));
					} catch (e) {
						if (!errors[dirpath]) errors[dirpath] = [];
						errors[dirpath].push(
							`failed to parse dynamic parameters of message "${key}" in "${defaultLang}.json" - see error above and make sure your param is correctly wrapped in double curly brackets, i.e {{ ... }}.`,
						);
						console.error(e);
						return;
					}

					const inBaseButNotInLang = Array.from(baseParams.difference(params));
					if (inBaseButNotInLang.length) {
						if (!errors[dirpath]) errors[dirpath] = [];
						errors[dirpath].push(
							`message "${key}" has dynamic parameter(s) ${inBaseButNotInLang.map((p) => `"${p}"`).join(', ')} in "${defaultLang}.json" but not in "${lang}.json"`,
						);
						if (failFirst) return;
					}

					const inLangButNotInBase = Array.from(params.difference(baseParams));
					if (inLangButNotInBase.length) {
						if (!errors[dirpath]) errors[dirpath] = [];
						errors[dirpath].push(
							`message "${key}" has dynamic parameter(s) ${inLangButNotInBase.map((p) => `"${p}"`).join(', ')} in "${lang}.json" but not in "${defaultLang}.json"`
						);
						if (failFirst) return;
					}
				}
			}
		}),
	);

	return errors;
}
