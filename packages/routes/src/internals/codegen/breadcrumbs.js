import ts, { factory } from 'typescript';

import * as utils from './utils.js';

// TODO: add @__NO_SIDE_EFFECTS__

/**
 * @returns {ts.Node[]}
 */
export function importModulesForBreadcrumbs() {
	return [
		factory.createImportDeclaration(
			undefined,
			factory.createImportClause(
				false,
				undefined,
				factory.createNamespaceImport(factory.createIdentifier('n')),
			),
			factory.createStringLiteral('./names.js'),
			undefined,
		),
		factory.createImportDeclaration(
			undefined,
			factory.createImportClause(
				false,
				undefined,
				factory.createNamespaceImport(factory.createIdentifier('p')),
			),
			factory.createStringLiteral('./index.js'),
			undefined,
		),
	];
}

/**
 * @param {import("../../private.d.ts").Route[]} routes
 * @param {import("../../private.d.ts").RouteWithNameDef} route
 * @param {string} [langParamName]
 * @param {import('../../private.d.ts').BreadcrumbOptions<string>} [options]
 * @returns {[id: string, node: ts.Node]}
 */
export function defineBreadcrumbs(routes, route, langParamName, options) {
	const id = Array.isArray(route.segments)
		? utils.buildRouteIdentifier(route.segments)
		: utils.buildRouteIdentifier(route.segments.default);

	/** @type {ts.ObjectLiteralExpression[]} */
	const elements = [];
	/** @type {Set<string>} */
	const paramNames = new Set();

	const segments = Array.isArray(route.segments) ? route.segments : route.segments.default;

	for (let i = segments.length - 1; i >= 0; i--) {
		let path = segments.slice(0, i + 1).join('/');
		if (path === '') path = '/';
		const currentRoute = path === route.path ? route : routes.find((r) => r.path === path);
		if (!currentRoute) continue;
		const currentSegments = Array.isArray(currentRoute.segments)
			? currentRoute.segments
			: currentRoute.segments.default;
		const lastParam = currentRoute.params?.at(-1);

		/// 1. Build path property
		/** @type {ts.ObjectLiteralExpression[]} */
		let pathArgs = [];
		if (currentRoute.params?.length) {
			/** @type {ts.PropertyAssignment[]} */
			const properties = [];
			for (const param of currentRoute.params) {
				paramNames.add(param.name);
				properties.push(
					factory.createPropertyAssignment(
						factory.createIdentifier(param.name),
						param.name === langParamName
							? factory.createPropertyAccessExpression(
									factory.createIdentifier('params'),
									factory.createIdentifier(param.name),
								)
							: factory.createElementAccessExpression(
									factory.createPropertyAccessExpression(
										factory.createIdentifier('params'),
										factory.createIdentifier(param.name),
									),
									factory.createNumericLiteral('0'),
								),
					),
				);
			}
			pathArgs.push(factory.createObjectLiteralExpression(properties));
		}

		/// 2. Build name property
		/** @type {ts.CallExpression | ts.ElementAccessExpression} */
		let nameInitializer;
		if (
			lastParam &&
			lastParam.position === currentSegments.length - 1 &&
			lastParam.name !== langParamName
		) {
			paramNames.add(lastParam.name);
			// if current segment is dynamic and not lang, reference
			// params directly
			nameInitializer = factory.createElementAccessExpression(
				factory.createPropertyAccessExpression(
					factory.createIdentifier('params'),
					factory.createIdentifier(lastParam.name),
				),
				factory.createNumericLiteral('1'),
			);
		} else if (currentRoute.name) {
			if (!langParamName) {
				throw new Error('Route with localization must provide a param name to resolve language');
			}
			/** @type {ts.PropertyAccessExpression[]} */
			const args = [];
			if (typeof currentRoute.name !== 'string') {
				paramNames.add(langParamName);
				args.push(
					factory.createPropertyAccessExpression(
						factory.createIdentifier('params'),
						factory.createIdentifier(langParamName),
					),
				);
			}
			// otherwise, use name if defined
			nameInitializer = factory.createCallExpression(
				factory.createElementAccessExpression(
					factory.createIdentifier('n'),
					factory.createStringLiteral(path),
				),
				undefined,
				args,
			);
		} else {
			continue;
		}

		/// 3. Assemble
		elements.push(
			factory.createObjectLiteralExpression([
				// path: p['...']({ ... })
				factory.createPropertyAssignment(
					factory.createIdentifier('path'),
					factory.createCallExpression(
						factory.createElementAccessExpression(
							factory.createIdentifier('p'),
							factory.createStringLiteral(path),
						),
						undefined,
						pathArgs,
					),
				),
				// name: p['...']('...'), or
				// name: params.[...][1]
				factory.createPropertyAssignment(factory.createIdentifier('name'), nameInitializer),
			]),
		);

		if (path === options?.root) break;
	}

	const node = factory.createFunctionDeclaration(
		undefined,
		undefined,
		factory.createIdentifier(id),
		undefined,
		paramNames.size
			? [
					factory.createParameterDeclaration(
						undefined,
						undefined,
						factory.createIdentifier('params'),
						undefined,
						undefined,
						undefined,
					),
				]
			: [],
		undefined,
		factory.createBlock(
			[
				factory.createReturnStatement(
					factory.createArrayLiteralExpression(elements.toReversed(), true),
				),
			],
			true,
		),
	);

	if (paramNames.size) {
		const paramTypings = [...paramNames]
			.map(
				(name) =>
					`${name}: ${name === langParamName ? 'string' : '[param: string, anme: string]'};`,
			)
			.join(' ');
		ts.addSyntheticLeadingComment(
			node,
			ts.SyntaxKind.MultiLineCommentTrivia,
			`*@param {{ ${paramTypings} }} params @returns {{ path: string, name: string}[]}`,
		);
	}

	return [id, node];
}
