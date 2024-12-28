/**
 * Check if a string contains HTML
 * @param {string} str - the input string to check
 * @returns {boolean} whether the input string contains HTML
 */
export function containsHtml(str) {
	return /<\/?[a-z][\s\S]*>/i.test(str);
}

/**
 * Check if a string is HTML
 * i.e. '<element>...</element>'
 *
 * @param {string} str - the input string to check
 * @returns {boolean} whether the input string is HTML
 */
export function isHtml(str) {
	return /^<[a-z]+.*<\/[a-z]+>$/i.test(str) || /^<[a-z]+.*\/>$/i.test(str);
}

/**
 * Check if a string contains dynamic parameters
 * @param {string} str - the input string to check
 * @returns {boolean} whether the input string contains dynamic parameters
 */
export function containsParameters(str) {
	return /{{.*}}/i.test(str);
}

/**
 * Split a string with dynamic parameters into an array.
 * For example:
 *	 - input: 'some text {{param}}'
 *	 - output: [{type: 'literal', content: 'some text '}, {type: 'identifier', content: 'param'}]
 * @param {string} str - the input string to split
 * @returns {{type: 'identifier' | 'literal', content: string}[]}
 */
export function splitStrWithParameters(str) {
	/** @type {{type: 'identifier' | 'literal', content: string}[]} */
	const chunks = [];
	let index = str.indexOf('{{');
	let remainder = str;
	while (index !== -1) {
		const literal = remainder.slice(0, index);
		if (literal) chunks.push({ type: 'literal', content: literal });
		const end = remainder.indexOf('}}', index);
		const identifier = remainder.slice(index + 2, end);
		chunks.push({ type: 'identifier', content: identifier });
		remainder = remainder.slice(end + 2);
		index = remainder.indexOf('{{');
	}
	chunks.push({ type: 'literal', content: remainder });
	return chunks;
}

