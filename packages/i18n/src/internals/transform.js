import * as codegen from './codegen.js';
import { parseMessageParams } from './parse.js';
import * as utils from './utils.js';

/**
 * collect messages from locale definition
 * and build corresponding JS module
 * @param {import('./private.d.ts').Locale} locale
 * @param {string} lang
 * @returns {string}
 */
export function transformLocale(locale, lang) {
	/** @type {import('typescript').Node[]} */
	const exports = [];

	/** @type {Parameters<typeof import('./codegen.js').importRuntimeFactoryFunctions>} */
	let runtimeImportFlags = [false, false, false];

	/// Transform each message definition into string, function, or snippet
	/// depending on whether it contains HTML and/or dynamic parameters
	for (const [key, content] of Object.entries(locale.messages)) {
		const params = parseMessageParams(content);

		/** @type {import('../runtime').MessageType} */
		let type = 'string';
		if (utils.containsHtml(content)) type = 'snippet';
		else if (params.length) type = 'function';

		switch (type) {
			case 'string':
				runtimeImportFlags[0] = true;
				exports.push(...codegen.exportMessageString(key, content));
				break;
			case 'function':
				runtimeImportFlags[1] = true;
				exports.push(...codegen.exportMessageFunction(key, content, params));
				break;
			case 'snippet':
				runtimeImportFlags[2] = true;
				exports.push(...codegen.exportMessageSnippet(key, content, params));
				break;
		}
	}

	/// Import runtime factory functions, depending
	/// the presence of message types in the module
	/** @type {import('typescript').Node[]} */
	const imports = codegen.importRuntimeFactoryFunctions(...runtimeImportFlags);
	if (runtimeImportFlags[2]) {
		imports.push(...codegen.importSvelteSnippetUtil());
	}

	const content = codegen.print([...imports, codegen.newline(), ...exports], lang);

	return content;
}

