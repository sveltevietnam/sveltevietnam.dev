import { factory } from 'typescript';

import { generateMessage } from '../generate-message/index.js';
import { print, exportIdentifiersAsLiterals, importFactories, newline } from '../utils.js';

// ===========
// Public API
// ===========
/**
 * Generate a message wrapper function for each parsed message from source locale,
 * which imports and call the actual message function for each lang.
 * Put all these wrappers into the index JS module next to the locale message modules.
 * @param {Pick<import('../../parser').Message, 'key' | 'type'>[]} messages
 * @param {string[]} langs
 * @returns {string}
 */
export function generateMessageModule(messages, langs) {
	if (!messages.length) return '';

	/** @type {Set<string>} */
	const importIds = new Set();

	/** @type {import('typescript').Node[]} */
	const definitions = [];

	/** @type {Record<string, string> } */
	const exportMapping = {};

	for (const message of messages) {
		const { id, nodes } = generateMessage(message, langs);
		switch (message.type) {
			case 'simple':
				importIds.add('createMessageSimple');
				break;
			case 'with-params':
				importIds.add('createMessageWithParams');
				break;
		}
		definitions.push(...nodes);
		exportMapping[id] = message.key;
	}

	return print([
		...importFactories(Array.from(importIds)),
		newline(),
		...langs.toSorted().map((lang) =>
			// assuming lang is ISO-compliant, so safe to use as identifier
			factory.createImportDeclaration(
				undefined,
				factory.createImportClause(
					undefined,
					undefined,
					factory.createNamespaceImport(factory.createIdentifier(lang)),
				),
				factory.createStringLiteral(`./${lang}.js`),
				undefined,
			),
		),
		newline(),
		...definitions,
		exportIdentifiersAsLiterals(exportMapping),
	]);
}
