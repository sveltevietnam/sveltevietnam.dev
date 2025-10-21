import { compile } from '../../compiler/compile/index.js';
import { parseLocale } from '../../parser/parse-locale/index.js';
import { parseMessage } from '../../parser/parse-message/index.js';

// ===========
// Public API
// ===========
/**
 * @param {import('./types.public').BuildInput} input
 * @returns {Promise<import('./types.public').BuildOutput>}
 */
export async function build(input) {
	const { entries, parseOptions } = input;

	// ===================================
	// 1. Parse all locales at the same time
	// ===================================
	const langs = Object.keys(entries);
	const localeFilePathPerLang = Object.values(entries);
	const localePerLang = await Promise.all(
		langs.map(async (lang) => {
			const abspath = entries[lang];
			const messages = await parseLocale(abspath, parseOptions);
			return messages;
		}),
	);

	// ==============================================
	// 2. Check message key consistency across langs
	// ==============================================
	const messageKeySets = localePerLang.map((msgs) => new Set(Object.keys(msgs)));
	/** @type {import('./types.public').InconsistentKeyIssue[]} */
	const keyIssues = [];
	for (let currentIndex = 0; currentIndex < messageKeySets.length - 1; currentIndex++) {
		const currentSet = messageKeySets[currentIndex];
		for (let nextIndex = currentIndex + 1; nextIndex < messageKeySets.length; nextIndex++) {
			const nextSet = messageKeySets[nextIndex];
			const exclusiveInCurrent = currentSet.difference(nextSet);
			if (exclusiveInCurrent.size) {
				keyIssues.push(
					...exclusiveInCurrent.values().map((key) => ({
						key,
						in: localeFilePathPerLang[currentIndex],
						notIn: localeFilePathPerLang[nextIndex],
					})),
				);
			}
			const exclusiveInNext = nextSet.difference(currentSet);
			if (exclusiveInNext.size) {
				keyIssues.push(
					...exclusiveInNext.values().map((key) => ({
						key,
						in: localeFilePathPerLang[nextIndex],
						notIn: localeFilePathPerLang[currentIndex],
					})),
				);
			}
		}
	}
	if (keyIssues.length) {
		throw new ErrorInconsistentMessageKeys(
			'Inconsistent message keys across locale files, check `error.cause` for details',
			keyIssues,
		);
	}

	// ==========================================
	// 3. Parse all messages in all locale files
	// ==========================================
	/** @type {Record<string, import('../../parser/').Message>[]} */
	const keyToMessageMapPerLang = [];
	/** @type {import('../../parser/parse-message').ParseMessageError[]} */
	const parseMessageErrors = [];
	for (let i = 0; i < langs.length; i++) {
		const locale = localePerLang[i];
		/** @type {Record<string, import('../../parser/').Message>} */
		const keyToMessage = {};
		for (const [key, content] of Object.entries(locale)) {
			try {
				const params = parseMessage(content);
				keyToMessage[key] = {
					type: params.length ? 'with-params' : 'simple',
					key,
					content,
					params,
				};
			} catch (e) {
				const typedError = /** @type {import('../../parser/parse-message').ParseMessageError} */ (
					e
				);
				typedError.cause = { file: localeFilePathPerLang[i], key };
				parseMessageErrors.push(typedError);
				continue;
			}
		}
		keyToMessageMapPerLang.push(keyToMessage);
	}
	if (parseMessageErrors.length) {
		throw new ErrorMessageParse(
			'Failed to parse messages, check `error.cause` for details',
			parseMessageErrors,
		);
	}

	// ====================================================
	// 4. Check message parameter consistency across langs
	// ====================================================
	/** @type {import('./types.public').InconsistentParamIssue[]} */
	const paramIssues = [];
	const keys = Object.keys(localePerLang[0]);
	for (const key of keys) {
		let currentParams = keyToMessageMapPerLang[0][key].params;
		/** @type {import('./types.public').InconsistentParamIssue['in']} */
		let mismatchFoundIn = [{ file: localeFilePathPerLang[0], params: currentParams }];
		for (let i = 1; i < langs.length; i++) {
			const nextParams = keyToMessageMapPerLang[i][key].params;
			const currentParamNameSet = new Set(currentParams.map((p) => p.name));
			const nextParamNameSet = new Set(nextParams.map((p) => p.name));
			const symmetricDifference = currentParamNameSet.symmetricDifference(nextParamNameSet);
			if (symmetricDifference.size) {
				mismatchFoundIn.push({ file: localeFilePathPerLang[i], params: nextParams });
			}
			currentParams = nextParams;
		}
		if (mismatchFoundIn.length > 1) {
			paramIssues.push({ key, in: mismatchFoundIn });
		}
	}
	if (paramIssues.length) {
		throw new ErrorInconsistentMessageParams(
			'Inconsistent message parameters across locale files, check `error.cause` for details',
			paramIssues,
		);
	}

	// ===================================================
	// 5. Compile messages into a JS module for each lang
	// ===================================================
	/** @type {string[]} */
	const modulePerLang = [];
	for (let i = 0; i < langs.length; i++) {
		const messages = Object.values(keyToMessageMapPerLang[i]);
		modulePerLang.push(compile(messages));
	}

	// ===============================
	// 6. Putting everything together
	// ===============================
	/** @type {import('./types.public').Locale[]} */
	const locales = [];
	for (let i = 0; i < langs.length; i++) {
		locales.push({
			lang: langs[i],
			source: localeFilePathPerLang[i],
			module: modulePerLang[i],
			messages: Object.values(keyToMessageMapPerLang[i]),
		});
	}
	return locales;
}

// =======
// Errors
// =======
export class BuildError extends Error {
	/**
	 * @param {string} message
	 * @param {string} [name]
	 */
	constructor(message, name = 'BuildError') {
		super(message);
		this.name = name;
	}
}

export class ErrorInconsistentMessageKeys extends BuildError {
	/** @type {import('./types.public').InconsistentKeyIssue[]} */
	cause;

	/**
	 * @param {string} message
	 * @param {import('./types.public').InconsistentKeyIssue[]} issues
	 */
	constructor(message, issues) {
		super(message, 'ErrorInconsistentMessageKeys');
		this.cause = issues;
	}
}

export class ErrorInconsistentMessageParams extends BuildError {
	/** @type {import('./types.public').InconsistentParamIssue[]} */
	cause;

	/**
	 * @param {string} message
	 * @param {import('./types.public').InconsistentParamIssue[]} issues
	 */
	constructor(message, issues) {
		super(message, 'ErrorInconsistentMessageParams');
		this.cause = issues;
	}
}

export class ErrorMessageParse extends BuildError {
	/** @type {import('../../parser/parse-message').ParseMessageError[]} */
	cause;

	/**
	 * @param {string} message
	 * @param {import('../../parser/parse-message').ParseMessageError[]} errors
	 */
	constructor(message, errors) {
		super(message, 'ErrorMessageParse');
		this.cause = errors;
	}
}

// // ==========
// // Internals
// // ==========
// //
// /** @param {string} name */
// function createError(name) {
// 	return class extends BuildError {
// 		/** @param {string} message  */
// 		constructor(message) {
// 			super(message, name);
// 		}
// 	};
// }
