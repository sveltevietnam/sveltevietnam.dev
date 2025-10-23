import { generateMessageTarget } from '../generate-message-target/index.js';
import { print, exportIdentifiersAsLiterals } from '../utils.js';

// ===========
// Public API
// ===========
/**
 * Generate message function for each parsed message from source locale,
 * and export them via a lang-specific JS module
 * @param {import('../../parser').Message[]} messages
 * @returns {string}
 */
export function generateMessageTargetModule(messages) {
	if (!messages.length) return '';

	/** @type {import('typescript').Node[]} */
	const definitions = [];

	/** @type {Record<string, string> } */
	const exportMapping = {};

	for (const message of messages) {
		const { id, nodes } = generateMessageTarget(message);
		definitions.push(...nodes);
		exportMapping[id] = message.key;
	}

	return print([...definitions, exportIdentifiersAsLiterals(exportMapping)]);
}
