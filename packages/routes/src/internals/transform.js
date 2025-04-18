import * as codegen from './codegen.js';

/**
 * @param {import("../private.d.ts").Route[]} routes
 * @returns {{ module: string; types: string; report: { numDynamic: number; numStatic: number } }}
 */
export function transform(routes) {
	/** @type {import('typescript').Node[]} */
	const definitions = [];
	/** @type {[identifier: string, literal: string][]}*/
	const exports = [];
	/** @type {string[]} */
	const dynamicPaths = [];
	/** @type {string[]} */
	const staticPaths = [];

	for (const route of routes) {
		/** @type {string} */
		let id;
		/** @type {import('typescript').Node} */
		let node;
		if (route.params?.length) {
			dynamicPaths.push(route.path);
			[id, node] = codegen.defineDynamicRoute(route);
		} else {
			staticPaths.push(route.path);
			[id, node] = codegen.defineStaticRoute(route);
		}
		definitions.push(node);
		exports.push([id, route.path]);
	}

	const moduleContent = codegen.print([
		...definitions,
		codegen.newline(),
		codegen.exportIdentifierAsLiterals(exports),
	]);

	const types = codegen.print(codegen.exportRoutePathTypeDef(dynamicPaths, staticPaths));

	return {
		module: moduleContent,
		types,
		report: {
			numDynamic: dynamicPaths.length,
			numStatic: staticPaths.length,
		},
	};
}
