import { flatParseMessages } from './parse.js';
import { transform } from './transform.js';

/**
 * @typedef BuildOutput
 * @property {Record<string, Record<string, string>>} messages - the parsed messages
 * @property {string} module - the output JS module source code
 */

/**
 * @param {Record<string, string>} yamls - lang to yaml string map
 * @returns {Promise<BuildOutput>} the output JS module source code
 */
export async function build(yamls) {
	const messages = await flatParseMessages(yamls);
	return {
		messages,
		module: transform(messages),
	};
}
