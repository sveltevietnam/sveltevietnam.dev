import { parseMessageParams } from './parse.js';

/** @typedef {{ message: string; e?: unknown }} Issue */
/** @typedef {{ issuesByKey: Record<string, Issue[]> }} LintOutput */

/**
 * @param {Record<string, Record<string, string>>} messages - parsed message flatmap
 * @param {string[]} langs - list of langs to lint against
 * @param {boolean} failFirst - whether to stop on the first error
 * @returns {LintOutput} list of lint error message per locale directory
 */
export function lint(messages, langs, failFirst = false) {
	/** @type {Record<string, Issue[]>} */
	const issuesByKey = {};

	/**
	 * @param {string} key - the message key
	 * @param {string} message - the error message
	 * @param {unknown} [e] - the error object
	 **/
	function addIssue(key, message, e) {
		if (!issuesByKey[key]) issuesByKey[key] = [];
		issuesByKey[key].push({ message, e });
	}

	for (const [key, valueByLang] of Object.entries(messages)) {
		/// 1 - check for missing per-lang messages
		if (Object.keys(valueByLang).length !== langs.length) {
			addIssue(key, `missing message in "${langs.filter((l) => !valueByLang[l]).join(',')}"`);
			if (failFirst) return { issuesByKey };
		}

		/// 2 - check for inconsistent message parameters across lang
		/** @type {Record<string, string[]>} */
		const paramsByLang = {};
		for (const [lang, value] of Object.entries(valueByLang)) {
			try {
				paramsByLang[lang] = parseMessageParams(value).map((p) => p.name);
			} catch (e) {
				addIssue(
					key,
					`failed to parse dynamic parameters in "${lang}", make sure your param is correctly wrapped in double curly brackets, i.e {{ ... }}.`,
					e,
				);
				if (failFirst) return { issuesByKey };
			}
		}

		const allParams = Object.values(paramsByLang).flat();
		const uniqueParams = new Set(allParams);
		if (uniqueParams.size * Object.keys(paramsByLang).length !== allParams.length) {
			addIssue(
				key,
				`inconsistent usage of dynamic parameters: ${Object.entries(paramsByLang)
					.map(
						([lang, params]) =>
							(params.length ? `[${params.map((p) => `"${p}"`).join(', ')}]` : 'none') +
							` in "${lang}"`,
					)
					.join('; ')}`,
			);
			if (failFirst) return { issuesByKey };
		}
	}

	return { issuesByKey };
}
