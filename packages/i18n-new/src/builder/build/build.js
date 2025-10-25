import {
	generateMessageTargetModule,
	generateMessageModule,
	generateConstantsModule,
	generateDts,
} from '../../compiler/index.js';
import { parseLocale } from '../../parser/parse-locale/index.js';

// ===========
// Public API
// ===========
/**
 * @param {import('./types.public').BuildInput} input
 * @returns {Promise<import('./types.public').BuildOutput>}
 */
export async function build(input) {
	const { entries, parseOptions, mode = 'static' } = input;

	// ===================================
	// 1. Parse all locales at the same time
	// ===================================
	const langs = Object.keys(entries);
	const localeFilePathPerLang = Object.values(entries);
	const localePerLang = await Promise.all(
		langs.map(async (lang) => {
			const abspath = entries[lang];
			return await parseLocale(abspath, parseOptions);
		}),
	);

	// ==============================================
	// 2. Check message key consistency across langs
	// ==============================================
	const messageKeySets = localePerLang.map((locale) => new Set(locale.messages.map((m) => m.key)));
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

	// ====================================================
	// 4. Check message parameter consistency across langs
	// ====================================================
	const keyToMessageMapPerLang = localePerLang.map((locale) => {
		/** @type {Record<string, import('../../parser/index.js').SourceMessage>} */
		const map = {};
		for (const message of locale.messages) {
			map[message.key] = message;
		}
		return map;
	});
	/** @type {import('./types.public').InconsistentParamIssue[]} */
	const paramIssues = [];
	const keys = Object.keys(keyToMessageMapPerLang[0]);
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
		modulePerLang.push(generateMessageTargetModule(messages));
	}

	// ===============================
	// 6. Putting everything together
	// ===============================
	/** @type {import('./types.public').BuildOutput['modules']['messages']['targets']} */
	const targets = {};
	for (let i = 0; i < langs.length; i++) {
		const lang = langs[i];
		const module = modulePerLang[i];
		targets[lang] = module;
	}
	const index = generateMessageModule(Object.values(keyToMessageMapPerLang[0]), langs);
	const constants = generateConstantsModule({ keys, langs, mode });

	let dts = '';
	if (mode === 'remote') {
		dts = generateDts(mode);
	}

	return {
		modules: {
			messages: { targets, index },
			constants,
			dts,
		},
		numMessages: keys.length,
		sources: Array.from(
			new Set([
				...localeFilePathPerLang,
				...localePerLang.flatMap((locale) => Array.from(locale.dependencies)),
			]),
		),
	};
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
