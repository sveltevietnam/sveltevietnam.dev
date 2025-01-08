/**
 *	Extracts the route key from a SvelteKit route.id.
 *	@param {string} id - The route.id to extract the key from.
 *	@returns {App.RouteKey} The extracted route key.
 */
export function getKeyFromRoute(id) {
	return /** @type {App.RouteKey} */ (
		id
			// remove layout group (...)
			.replace(/\/\([^)]*\)/g, '')
			// replace [[param=...]] with :param
			.replace(/\[+(.*)[\]=]/g, (_, p1) => ':' + p1)
			.slice(1) || 'home'
	);
}

/**
 * Parses a string template with placeholders (:param)
 * and replaces them with the provided parameters.
 * @param {string} str - The string template to parse.
 * @param {string[]} params - The parameters to replace the placeholders with.
 * @returns {string} The built string.
 */
export function build(str, ...params) {
	return str.replace(/:(\w+)/g, (_, name) => params.shift() ?? name);
}

/**
 * Parses a string template with placeholders (:param)
 * into a regular expression to match against a built path.
 *
 * For example, the template '/blog/categories/:category' will be parsed into
 * the regular expression /\/blog\/categories\/([^/]+)/g.
 * @param {string} str - The string template to parse.
 * @returns {RegExp} The built regular expression.
 */
export function buildRegex(str) {
	return new RegExp(str.replace(/:(\w+)/g, '([^/]+)'), 'g');
}
