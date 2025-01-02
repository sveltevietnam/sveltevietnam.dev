import fs from 'node:fs/promises';

import * as v from 'valibot';

export const LocaleSchema = v.object({
	messages: v.record(v.string(), v.string()),
});

/**
 * parse locale files
 * @param {string} filepath - list of locale file paths
 * @returns {Promise<import('./private.d.ts').Locale>}
 */
export async function parseLocale(filepath) {
	const file = await fs.readFile(filepath, 'utf-8');
	return v.parse(LocaleSchema, JSON.parse(file));
}

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
