import { generateStringArrayConstant } from '../generate-string-array-constant/index.js';
import { generateStringConstant } from '../generate-string-constant/genrate-string-constant.js';
import { print } from '../utils.js';

// ===========
// Public API
// ===========
/**
 * @typedef Input
 * @property {string[]} langs
 * @property {string[]} keys
 * @property {string} mode
 */

/**
 * @param {Input} input
 * @returns {string}
 */
export function generateConstantsModule(input) {
	const nodes = [
		generateStringConstant('mode', input.mode),
		generateStringArrayConstant('langs', input.langs, true),
		generateStringArrayConstant('keys', input.keys),
	];

	return print(nodes);
}
