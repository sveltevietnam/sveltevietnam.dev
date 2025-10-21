import { defineMessageFunction } from '../codegen/define-message-function.js';
import { exportIdentifiersAsLiterals } from '../codegen/export-identifiers-as-literals.js';
import { importFactories } from '../codegen/import-factores.js';
import { newline, print } from '../codegen/print.js';

// ===========
// Public API
// ===========
/**
 * @param {import('../../../parser').Message[]} messages
 * @returns {string}
 */
export function compile(messages) {
	if (!messages.length) return '';

	/** @type {import('typescript').Node[]} */
	const definitions = [];

	/** @type {Set<'createMessageSimple' | 'createMessageWithParams'>} */
	const importIds = new Set();

	/** @type {Record<string, string> } */
	const exports = {};

	for (const message of messages) {
		const { id, node } = defineMessageFunction(message);
		definitions.push(node);
		exports[id] = message.key;
		switch (message.type) {
			case 'simple':
				importIds.add('createMessageSimple');
				break;
			case 'with-params':
				importIds.add('createMessageWithParams');
				break;
		}
	}

	// import factory functions, depending
	// the presence of message types in the module
	/** @type {import('typescript').Node[]} */
	const imports = importFactories([...importIds]);

	const content = print([
		...imports,
		newline(),
		...definitions,
		exportIdentifiersAsLiterals(exports),
	]);

	return content;
}

// // =======
// // Errors
// // =======
// export class CompileError extends Error {
// 	/**
// 	 * @param {string} message
// 	 * @param {string} [name]
// 	 */
// 	constructor(message, name = 'CompileError') {
// 		super(message);
// 		this.name = name;
// 	}
// }
//
// // ==========
// // Internals
// // ==========
// //
// /** @param {string} name */
// function createError(name) {
// 	return class extends CompileError {
// 		/** @param {string} message  */
// 		constructor(message) {
// 			super(message, name);
// 		}
// 	};
// }
