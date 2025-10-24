import { generateStringArrayConstant } from '../generate-string-array-constant/index.js';
import { print } from '../utils.js';

// ===========
// Public API
// ===========
/**
 * @typedef Input
 * @property {string[]} langs
 * @property {string[]} keys
 */

/**
 * @param {Input} input
 * @returns {string}
 */
export function generateConstantsModule(input) {
	const nodes = [
		generateStringArrayConstant('langs', input.langs, true),
		generateStringArrayConstant('keys', input.keys),
	];

	return print(nodes);
}
