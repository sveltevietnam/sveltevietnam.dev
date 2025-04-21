/**
 * @param {import("../private").Route[]} routes
 * @param {import("../private").ExcludeOption<string>} [exclude]
 * @returns {{ included: import("../private").Route[], excluded: import("../private").Route[] }}
 */
export function filterRoutes(routes, exclude) {
	if (!exclude) {
		return { included: routes, excluded: [] };
	}

	/** @type {Set<string> | undefined} */
	let paths = undefined;
	/** @type {string[] | undefined} */
	let patterns = undefined;

	if (Array.isArray(exclude)) {
		paths = new Set(exclude);
	} else {
		if (exclude.paths) {
			paths = new Set(exclude.paths);
		}
		if (exclude.patterns) {
			patterns = Array.isArray(exclude.patterns) ? exclude.patterns : [exclude.patterns];
		}
	}

	/** @type {import("../private").Route[]} */
	const included = [];
	/** @type {import("../private").Route[]} */
	const excluded = [];

	for (const route of routes) {
		if (paths && paths.has(route.path)) {
			excluded.push(route);
		} else if (patterns && patterns.some((pattern) => route.path.match(pattern))) {
			excluded.push(route);
		} else {
			included.push(route);
		}
	}

	return { included, excluded };
}
