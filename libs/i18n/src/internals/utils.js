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
 * @param {string} str - the input string to check
 * @returns {boolean} whether the input string is HTML
 */
export function isHtml(str) {
	return /^<[a-z]+.*<\/[a-z]+>$/i.test(str) || /^<[a-z]+.*\/>$/i.test(str);
}

