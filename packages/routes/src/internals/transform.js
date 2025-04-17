import * as codegen from './codegen.js';

/**
 * @param {import("../private.d.ts").Route[]} routes
 * @returns {{ module: string, report: { numDynamic: number; numStatic: number } }}
 */
export function transform(routes) {
	/** @type {import('typescript').Node[]} */
	const definitions = [];
	/** @type {[identifier: string, literal: string][]}*/
	const exports = [];
	const report = {
		numDynamic: 0,
		numStatic: 0,
	};

	for (const route of routes) {
		/** @type {string} */
		let id;
		/** @type {import('typescript').Node} */
		let node;
		if (route.params?.length) {
			report.numDynamic++;
			[id, node] = codegen.defineDynamicRoute(route);
		} else {
			report.numStatic++;
			[id, node] = codegen.defineStaticRoute(route);
		}
		definitions.push(node);
		exports.push([id, route.path]);
	}

	const content = codegen.print([
		...definitions,
		codegen.newline(),
		codegen.exportIdentifierAsLiterals(exports),
	]);

	return { module: content, report };
}
