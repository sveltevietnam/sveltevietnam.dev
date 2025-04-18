import ts, { factory } from 'typescript';

import * as utils from './utils.js';

// TODO: add @__NO_SIDE_EFFECTS__

/** @typedef {Omit<import('../../private.d.ts').Route, 'name'> & Required<Pick<import('../../private.d.ts').Route, 'name'>>} RouteWithNameDef */

/**
 * @param {RouteWithNameDef} route
 * @param {string} [langParamName]
 * @returns {[id: string, node: ts.Node]}
 */
export function defineStaticName(route, langParamName) {
	/** @type {ts.ParameterDeclaration[]} */
	const paramDeclaration = [];

	let localized = false;
	/** @type {string} */
	let fallbackName;
	/** @type {ts.IfStatement[]} */
	const ifs = [];

	const id = Array.isArray(route.segments)
		? utils.buildRouteIdentifier(route.segments)
		: utils.buildRouteIdentifier(route.segments.default);

	if (typeof route.name === 'string') {
		fallbackName = route.name;
	} else {
		const { default: defaultName, ...langToName } = route.name;
		fallbackName = defaultName;

		localized = Object.keys(langToName).length > 0;
		if (localized) {
			if (!langParamName) {
				throw new Error(
					'Dynamic route with localization must provide a param name to resolve language',
				);
			}

			paramDeclaration.push(
				factory.createParameterDeclaration(
					undefined,
					undefined,
					factory.createIdentifier(langParamName),
					undefined,
					undefined,
					undefined,
				),
			);

			for (const [lang, name] of Object.entries(langToName)) {
				ifs.push(
					factory.createIfStatement(
						factory.createBinaryExpression(
							factory.createIdentifier(langParamName),
							factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
							factory.createStringLiteral(lang),
						),
						factory.createBlock(
							[factory.createReturnStatement(factory.createStringLiteral(name))],
							true,
						),
						undefined,
					),
				);
			}
		}
	}

	const node = factory.createVariableDeclarationList(
		[
			factory.createVariableDeclaration(
				factory.createIdentifier(id),
				undefined,
				undefined,
				factory.createFunctionExpression(
					undefined,
					undefined,
					undefined,
					undefined,
					paramDeclaration,
					undefined,
					factory.createBlock(
						[...ifs, factory.createReturnStatement(factory.createStringLiteral(fallbackName))],
						true,
					),
				),
			),
		],
		ts.NodeFlags.Const,
	);

	if (localized) {
		ts.addSyntheticLeadingComment(
			node,
			ts.SyntaxKind.MultiLineCommentTrivia,
			`*@param {string} [${langParamName}] @returns {string}`,
		);
	}

	return [id, node];
}
