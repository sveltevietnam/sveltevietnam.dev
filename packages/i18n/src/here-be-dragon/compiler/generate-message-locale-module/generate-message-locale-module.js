import { generateMessageFunction } from '../generate-message-function/index.js';
import { print, exportIdentifiersAsLiterals } from '../utils.js';

// ===========
// Public API
// ===========
/**
 * Generate message function for each parsed message from source locale,
 * and export them via a JS module
 * @param {import('../../parser').Message[]} messages
 * @returns {string}
 */
export function generateMessageLocaleModule(messages) {
	if (!messages.length) return '';

	/** @type {import('typescript').Node[]} */
	const definitions = [];

	/** @type {Record<string, string> } */
	const exports = {};

	for (const message of messages) {
		const { id, nodes } = generateMessageFunction(message);
		definitions.push(...nodes);
		exports[id] = message.key;
	}

	return print([...definitions, exportIdentifiersAsLiterals(exports)]);
}
