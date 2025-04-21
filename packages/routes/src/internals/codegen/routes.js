import ts, { factory } from 'typescript';

import * as utils from './utils.js';

// TODO: add @__NO_SIDE_EFFECTS__

/**
 * @param {import('../../private.d.ts').Route} route
 * @param {string} [langParamName]
 * @returns {[id: string, node: ts.Node]}
 */
export function defineStaticRoute(route, langParamName) {
	/** @type {ts.ParameterDeclaration[]} */
	const paramDeclaration = [];

	let localized = false;
	/** @type {string} */
	let path;
	/** @type {string} */
	let id;
	/** @type {ts.IfStatement[]} */
	const ifs = [];

	if (Array.isArray(route.segments)) {
		id = utils.buildRouteIdentifier(route.segments);
		path = route.segments.join('/');
		if (path === '') path = '/';
	} else {
		const { default: defaultSegments, ...langToSegments } = route.segments;
		path = defaultSegments.join('/');
		if (path === '') path = '/';

		// NOTE: assuming latin here (svelte kit routes)
		id = utils.buildRouteIdentifier(defaultSegments);

		localized = Object.keys(langToSegments).length > 0;
		if (localized) {
			if (!langParamName) {
				throw new Error('Route with localization must provide a param name to resolve language');
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

			for (const [lang, segs] of Object.entries(langToSegments)) {
				ifs.push(
					factory.createIfStatement(
						factory.createBinaryExpression(
							factory.createIdentifier(langParamName),
							factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
							factory.createStringLiteral(lang),
						),
						factory.createBlock(
							[factory.createReturnStatement(factory.createStringLiteral(segs.join('/')))],
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
						[...ifs, factory.createReturnStatement(factory.createStringLiteral(path))],
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

/**
 * @param {import('../../private.d.ts').Param[]} params
 * @param {(v: string) => string} varRef
 * @returns {ts.VariableStatement[]}
 */
function buildVariableStatements(params, varRef) {
	/** @type {ts.VariableStatement[]} */
	const vars = [];
	for (let i = 0; i < params.length; i++) {
		const param = params[i];

		vars.push(
			factory.createVariableStatement(
				undefined,
				factory.createVariableDeclarationList(
					[
						factory.createVariableDeclaration(
							factory.createIdentifier(varRef(param.name)),
							undefined,
							undefined,
							factory.createConditionalExpression(
								factory.createPropertyAccessExpression(
									factory.createIdentifier('params'),
									factory.createIdentifier(param.name),
								),
								factory.createToken(ts.SyntaxKind.QuestionToken),
								factory.createBinaryExpression(
									factory.createStringLiteral('/'),
									factory.createToken(ts.SyntaxKind.PlusToken),
									factory.createPropertyAccessExpression(
										factory.createIdentifier('params'),
										factory.createIdentifier(param.name),
									),
								),
								factory.createToken(ts.SyntaxKind.ColonToken),
								factory.createStringLiteral(''),
							),
						),
					],
					ts.NodeFlags.Const,
				),
			),
		);
	}
	return vars;
}

/**
 * @param {string[]} segments
 * @param {import('../../private.d.ts').Param[]} params
 * @param {(v: string) => string} varRef
 * @returns {ts.TemplateExpression}
 */
function buildTemplateExpression(segments, params, varRef) {
	const literal = segments.slice(0, params[0].position).join('/');
	const head = factory.createTemplateHead(literal ? `/${literal}` : '');

	/** @type {ts.TemplateSpan[]} */
	const spans = [];
	for (let i = 0; i < params.length; i++) {
		const param = params[i];

		const identifier = factory.createIdentifier(varRef(param.name));
		const nextI = i + 1;
		if (nextI < params.length) {
			const literal = segments.slice(param.position + 1, params[nextI].position).join('/');
			const middle = factory.createTemplateMiddle(literal ? `/${literal}` : '/');
			spans.push(factory.createTemplateSpan(identifier, middle));
		} else {
			const literal = segments.slice(param.position + 1).join('/');
			const tail = factory.createTemplateTail(literal ? `/${literal}` : '');
			spans.push(factory.createTemplateSpan(identifier, tail));
		}
	}
	return factory.createTemplateExpression(head, spans);
}

/**
 * @param {import('../../private.d.ts').Route} route
 * @param {string} [langParamName]
 * @returns {[id: string, node: ts.Node]}
 */
export function defineDynamicRoute(route, langParamName) {
	if (!route.params) {
		throw new Error('Dynamic route must have params');
	}
	/**
	 * @param {string} name
	 * @returns {string}
	 */
	const varRef = (name) => '_' + name;

	/** @type {string} */
	let id;
	/** @type {ts.TemplateExpression} */
	let defaultTemplateExpression;
	/** @type {ts.IfStatement[]} */
	const ifs = [];

	let localized = false;
	if (Array.isArray(route.segments)) {
		id = utils.buildRouteIdentifier(route.segments);
		defaultTemplateExpression = buildTemplateExpression(route.segments, route.params, varRef);
	} else {
		const { default: defaultSegments, ...langToSegments } = route.segments;
		defaultTemplateExpression = buildTemplateExpression(defaultSegments, route.params, varRef);

		// NOTE: assuming latin here (svelte kit routes)
		id = utils.buildRouteIdentifier(defaultSegments);

		localized = Object.keys(langToSegments).length > 0;
		if (localized) {
			if (!langParamName) {
				throw new Error('Route with localization must provide a param name to resolve language');
			}
			for (const [lang, segs] of Object.entries(langToSegments)) {
				ifs.push(
					factory.createIfStatement(
						factory.createBinaryExpression(
							factory.createPropertyAccessExpression(
								factory.createIdentifier('params'),
								factory.createIdentifier(langParamName),
							),
							factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
							factory.createStringLiteral(lang),
						),
						factory.createBlock(
							[factory.createReturnStatement(buildTemplateExpression(segs, route.params, varRef))],
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
					[
						factory.createParameterDeclaration(
							undefined,
							undefined,
							factory.createIdentifier('params'),
							undefined,
							undefined,
							undefined,
						),
					],
					undefined,
					factory.createBlock(
						[
							...buildVariableStatements(route.params, varRef),
							...ifs,
							factory.createReturnStatement(defaultTemplateExpression),
						],
						true,
					),
				),
			),
		],
		ts.NodeFlags.Const,
	);

	const params = [...route.params]; // shallow copy
	if (localized && langParamName && !params.some((p) => p.name === langParamName)) {
		params.push({
			name: langParamName,
			position: -1,
			required: false,
		});
	}
	const fields = params.map((p) => `${p.name}${p.required ? '' : '?'}: string;`).join(' ');
	ts.addSyntheticLeadingComment(
		node,
		ts.SyntaxKind.MultiLineCommentTrivia,
		`*@param {{ ${fields} }} params @returns {string}`,
	);

	return [id, node];
}

/**
 * @param {string} id
 * @param {string[]} literals
 * @returns {ts.Node}
 */
function exportUnionStringLiteralTypeDef(id, literals) {
	return factory.createTypeAliasDeclaration(
		[factory.createToken(ts.SyntaxKind.ExportKeyword)],
		factory.createIdentifier(id),
		undefined,
		factory.createUnionTypeNode(
			literals.map((l) => factory.createLiteralTypeNode(factory.createStringLiteral(l))),
		),
	);
}

/**
 * @param {string[]} dynamicPaths
 * @param {string[]} staticPaths
 * @param {string[]} excludedPaths
 * @returns {ts.Node[]}
 */
export function exportRoutePathTypeDef(dynamicPaths, staticPaths, excludedPaths) {
	/** @type {ts.Node[]} */
	const nodes = [];
	/** @type {ts.TypeReferenceNode[]} */
	const unions = [];

	if (dynamicPaths.length) {
		const id = 'DynamicRoutePath';
		nodes.push(exportUnionStringLiteralTypeDef(id, dynamicPaths));
		unions.push(factory.createTypeReferenceNode(factory.createIdentifier(id), undefined));
	}

	if (staticPaths.length) {
		const id = 'StaticRoutePath';
		nodes.push(exportUnionStringLiteralTypeDef(id, staticPaths));
		unions.push(factory.createTypeReferenceNode(factory.createIdentifier(id), undefined));
	}

	if (excludedPaths.length) {
		nodes.push(exportUnionStringLiteralTypeDef('ExcludedRoutePath', excludedPaths));
	}

	if (unions.length) {
		nodes.push(
			factory.createTypeAliasDeclaration(
				[factory.createToken(ts.SyntaxKind.ExportKeyword)],
				factory.createIdentifier('RoutePath'),
				undefined,
				factory.createUnionTypeNode(unions),
			),
		);
	}

	if (unions.length && excludedPaths.length) {
		nodes.push(
			factory.createTypeAliasDeclaration(
				[factory.createToken(ts.SyntaxKind.ExportKeyword)],
				factory.createIdentifier('AllRoutePath'),
				undefined,
				factory.createUnionTypeNode([
					...unions,
					factory.createTypeReferenceNode(factory.createIdentifier('ExcludedRoutePath'), undefined),
				]),
			),
		);
	}

	return nodes;
}
