import * as codegen from './codegen/index.js';
import * as utils from './utils.js';

// TODO: evaluate possibility of using the new SvelteKit `resolve` utility

/**
 * @param {import('../private.d.ts').Route[]} routes
 * @param {import('../private.d.ts').TransformOptions<string>} options
 * @returns {import('../private.d.ts').TransformOutput}
 */
export function transform(routes, options) {
	/** @type {import('../private.d.ts').TransformOutput['report']} */
	const report = {
		dynamicRoutes: [],
		staticRoutes: [],
		excludedRoutes: [],
	};

	const modules = {
		types: {
			/** @type {string[]} */
			dynamicPaths: [],
			/** @type {string[]} */
			staticPaths: [],
			/** @type {string[]} */
			excludedPaths: [],
		},
		routes: {
			/** @type {import('typescript').Node[]} */
			definitions: [],
			/** @type {[identifier: string, literal: string][]}*/
			exports: [],
		},
		reroute: {
			/** @type {import('../runtime/types.public.js').DynamicMapping[]} */
			dynamicMappings: [],
			/** @type {[localized: string, kit: string][]} */
			staticMappings: [],
		},
		names: {
			/** @type {import('typescript').Node[]} */
			definitions: [],
			/** @type {[identifier: string, literal: string][]}*/
			exports: [],
		},
		breadcrumbs: {
			/** @type {import('typescript').Node[]} */
			definitions: [],
			/** @type {[identifier: string, literal: string][]}*/
			exports: [],
		},
	};

	const { included, excluded } = utils.filterRoutes(routes, options?.exclude);
	modules.types.excludedPaths = excluded.map((route) => route.path);
	report.excludedRoutes = excluded;

	const breadcrumbsOptions =
		options.breadcrumbs === true
			? {}
			: typeof options.breadcrumbs === 'object'
				? options.breadcrumbs
				: undefined;

	for (const route of included) {
		/** @type {string} */
		let id;
		/** @type {import('typescript').Node} */
		let routeNode;
		/** @type {import('typescript').Node | null} */
		let nameNode = null;

		if (route.params?.length) {
			report.dynamicRoutes.push(route);
			modules.types.dynamicPaths.push(route.path);
			[id, routeNode] = codegen.defineDynamicRoute(route, options.localization?.param);

			// check if reroute mapping is necessary
			const { default: defaultSegments, ...langToSegments } = Array.isArray(route.segments)
				? { default: route.segments }
				: route.segments;
			if (Object.keys(langToSegments).length > 0) {
				/** @type {import('../private.d.ts').Param | null} */
				let langParam = null;
				/** @type {number[]} */
				const paramPositions = [];
				for (const param of route.params) {
					if (param.name === options.localization?.param) {
						langParam = param;
					} else {
						paramPositions.push(param.position);
					}
				}
				if (!paramPositions.length) {
					// static mapping
					modules.reroute.staticMappings.push(
						...Object.entries(langToSegments).map(([lang, segments]) => {
							const localized = [...segments];
							const kit = [...defaultSegments];
							if (langParam) {
								localized[langParam.position] = lang;
								kit[langParam.position] = lang;
							}
							return /** @type {[string, string]} */ ([localized.join('/'), kit.join('/')]);
						}),
					);
				} else {
					// dynamic mapping
					modules.reroute.dynamicMappings.push(
						...Object.entries(langToSegments).map(([lang, segments]) => {
							const localized = [...segments];
							const kit = [...defaultSegments];
							if (langParam) {
								localized[langParam.position] = lang;
								kit[langParam.position] = lang;
							}
							return { localized, paramPositions, kit };
						}),
					);
				}
			}
		} else {
			report.staticRoutes.push(route);
			modules.types.staticPaths.push(route.path);
			[id, routeNode] = codegen.defineStaticRoute(route, options.localization?.param);

			// check if reroute mapping is necessary
			const { default: defaultSegments, ...langToSegments } = Array.isArray(route.segments)
				? { default: route.segments }
				: route.segments;
			if (Object.keys(langToSegments).length > 0) {
				// static mapping
				modules.reroute.staticMappings.push(
					...Object.entries(langToSegments).map(([, segments]) => {
						const localized = [...segments];
						const kit = [...defaultSegments];
						return /** @type {[string, string]} */ ([localized.join('/'), kit.join('/')]);
					}),
				);
			}
		}

		// routes.js
		modules.routes.definitions.push(routeNode);
		modules.routes.exports.push([id, route.path]);

		// names.js
		if (route.name) {
			// generate name getter
			[id, nameNode] = codegen.defineStaticName(
				/** @type {import('../private.d.ts').RouteWithNameDef} */ (route),
				options.localization?.param,
			);
			modules.names.definitions.push(nameNode);
			modules.names.exports.push([id, route.path]);
		}
	}

	if (breadcrumbsOptions) {
		const { included: includedRoutesForBreadcrumbs } = utils.filterRoutes(
			included,
			breadcrumbsOptions.exclude,
		);
		for (const route of includedRoutesForBreadcrumbs) {
			// generate breadcrumbs getter
			const [id, breadcrumbsNode] = codegen.defineBreadcrumbs(
				included,
				/** @type {import('../private.d.ts').RouteWithNameDef} */ (route),
				options.localization?.param,
				breadcrumbsOptions,
			);
			modules.breadcrumbs.definitions.push(breadcrumbsNode);
			modules.breadcrumbs.exports.push([id, route.path]);
		}
	}

	return {
		report,
		modules: {
			types: codegen.print(
				codegen.exportRoutePathTypeDef(
					modules.types.dynamicPaths,
					modules.types.staticPaths,
					modules.types.excludedPaths,
				),
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
			breadcrumbs: modules.breadcrumbs.definitions.length
				? codegen.print([
						...codegen.importModulesForBreadcrumbs(),
						codegen.newline(),
						...modules.breadcrumbs.definitions,
						codegen.newline(),
						codegen.exportIdentifierAsLiterals(modules.breadcrumbs.exports),
					])
				: undefined,
			reroute:
				modules.reroute.dynamicMappings.length || modules.reroute.staticMappings.length
					? codegen.print([
							codegen.importRerouteRuntime(),
							codegen.newline(),
							codegen.defineRerouteStaticMappings(modules.reroute.staticMappings),
							codegen.newline(),
							codegen.defineRerouteDynamicMappings(modules.reroute.dynamicMappings),
							codegen.newline(),
							codegen.exportRerouteFactory(),
						])
					: undefined,
		},
	};
}
