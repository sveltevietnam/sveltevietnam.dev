import * as codegen from './codegen/index.js';

/**
 * @param {import("../private.d.ts").Route[]} routes
 * @param {string} [langParamName]
 * @returns {import('../private.d.ts').TransformOutput}
 */
export function transform(routes, langParamName) {
	/** @type {import('../private.d.ts').TransformOutput['report']} */
	const report = {
		dynamicRoutes: [],
		staticRoutes: [],
	};

	const modules = {
		types: {
			/** @type {string[]} */
			dynamicPaths: [],
			/** @type {string[]} */
			staticPaths: [],
		},
		routes: {
			/** @type {import('typescript').Node[]} */
			definitions: [],
			/** @type {[identifier: string, literal: string][]}*/
			exports: [],
		},
		names: {
			/** @type {import('typescript').Node[]} */
			definitions: [],
			/** @type {[identifier: string, literal: string][]}*/
			exports: [],
		},
	};

	for (const route of routes) {
		/** @type {string} */
		let id;
		/** @type {import('typescript').Node} */
		let routeNode;
		/** @type {import('typescript').Node | null} */
		let nameNode = null;

		if (route.params?.length) {
			report.dynamicRoutes.push(route);
			modules.types.dynamicPaths.push(route.path);
			[id, routeNode] = codegen.defineDynamicRoute(route, langParamName);
		} else {
			report.staticRoutes.push(route);
			modules.types.staticPaths.push(route.path);
			[id, routeNode] = codegen.defineStaticRoute(route, langParamName);
		}

		// routes.js
		modules.routes.definitions.push(routeNode);
		modules.routes.exports.push([id, route.path]);

		// names.js
		if (route.name) {
			[id, nameNode] = codegen.defineStaticName(
				/** @type {import('../private.d.ts').RouteWithNameDef} */ (route),
				langParamName,
			);
			modules.names.definitions.push(nameNode);
			modules.names.exports.push([id, route.path]);
		}
	}

	return {
		report,
		modules: {
			types: codegen.print(
				codegen.exportRoutePathTypeDef(modules.types.dynamicPaths, modules.types.staticPaths),
			),
			routes: codegen.print([
				...modules.routes.definitions,
				codegen.newline(),
				codegen.exportIdentifierAsLiterals(modules.routes.exports),
			]),
			names: modules.names.definitions.length
				? codegen.print([
						...modules.names.definitions,
						codegen.newline(),
						codegen.exportIdentifierAsLiterals(modules.names.exports),
					])
				: undefined,
			// breadcrumbs: '',
		},
	};
}
