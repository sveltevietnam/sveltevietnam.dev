import { parse } from 'yaml';

import { flattenRecursiveRecord } from './utils.js';

// TODO: implement source map from YAML

/**
 * parse locale files
 * @param {string} yaml - the input YAML string
 * @returns {Promise<import('./private.d.ts').LocaleSource>}
 */
export function parseLocaleYaml(yaml) {
	return parse(yaml.normalize());
}

/**
 * @param {Record<string, string>} yamls - lang to yaml string map
 * @returns {Promise<import('./private.d.ts').FlatParseMessageOutput>} - language to flat message map
 */
export async function flatParseMessages(yamls) {
	/** @type {Record<string, Record<string, string>>} */
	const localizedMessages = {};

	await Promise.all(
		Object.entries(yamls).map(async ([lang, yaml]) => {
			const source = await parseLocaleYaml(yaml);
			const messages = flattenRecursiveRecord(source.messages, {
				fallback: '',
			});

			for (const [key, value] of Object.entries(messages)) {
				if (!localizedMessages[key]) {
					localizedMessages[key] = { [lang]: value };
				} else {
					localizedMessages[key][lang] = value;
				}
			}
		}),
	);

	return {
		messages: localizedMessages,
		langs: Object.keys(yamls),
	};
}

// TODO: support @import directive to include other YAML files
// FIXME: support param with multiple occurrences
/**
 * collect parameters
 * @param {string} message - the input string to check
 * @returns {import('./private.d.ts').MessageParameter[]} list of dynamic parameters, if any
 */
export function parseMessageParams(message) {
	/** @type {import('./private.d.ts').MessageParameter[]} */
	const params = [];

	let start = message.indexOf('{{');
	while (start !== -1) {
		const end = message.indexOf('}}', start);
		if (end === -1) {
			throw new Error('Message containing invalid parameter format. Missing closing bracket "}}"');
		}
		const name = message.slice(start + 2, end);
		params.push({ name, start, end: end + 2 });
		start = message.indexOf('{{', end);
	}

	return params;
}
