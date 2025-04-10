import * as codegen from './codegen.js';
import { parseMessageParams } from './parse.js';
import * as utils from './utils.js';

/**
 * @param {Record<string, Record<string, string>>} messages
 * @returns {{ module: string }}
 */
export function transform(messages) {
	/** @type {import('typescript').Node[]} */
	const definitions = [];

	/** @type {Parameters<typeof import('./codegen.js').importRuntimeFactoryFunctions>} */
	let runtimeImportFlags = [true, false, false, false];

	/** @type {Record<string, string> } */
	const exports = {};

	/// Transform each message definition into string, function, or snippet
	/// depending on whether it contains HTML and/or dynamic parameters
	for (let [key, langToMessage] of Object.entries(messages)) {
		// avoiding conflict with reserved keywords,
		// just adding _ until there is a reliable upstream list
		// of all reserved keywords
		// @see https://github.com/microsoft/TypeScript/issues/2536
		const varName = '_' + key.replace(/\./g, '_');
		exports[varName] = key;

		for (const [lang, content] of Object.entries(langToMessage)) {
			const params = parseMessageParams(content);

			/** @type {import('../runtime').MessageType} */
			let type = 'string';
			if (utils.containsHtml(content)) type = 'snippet';
			else if (params.length) type = 'function';

			switch (type) {
				case 'string':
					runtimeImportFlags[1] = true;
					definitions.push(...codegen.defineMessageString(`${lang}${varName}`, content));
					break;
				case 'function':
					runtimeImportFlags[2] = true;
					definitions.push(...codegen.defineMessageFunction(`${lang}${varName}`, content, params));
					break;
				case 'snippet':
					runtimeImportFlags[3] = true;
					definitions.push(...codegen.defineMessageSnippet(`${lang}${varName}`, content, params));
					break;
			}
		}

		definitions.push(codegen.defineMessage(varName, Object.keys(langToMessage)));
	}

	/// import runtime factory functions, depending
	/// the presence of message types in the module
	/** @type {import('typescript').Node[]} */
	const imports = codegen.importRuntimeFactoryFunctions(...runtimeImportFlags);
	if (runtimeImportFlags[3]) {
		imports.push(...codegen.importSvelteSnippetUtil());
	}

	const content = codegen.print([
		...imports,
		codegen.newline(),
		...definitions,
		codegen.exportIdentifierAsLiterals(exports),
	]);

	return { module: content };
}
