import ts, { factory } from 'typescript';

export const newline = () => factory.createIdentifier('\n');

// TODO: add @__NO_SIDE_EFFECTS__

/**
 * @param {import('../private.d.ts').Route} route
 * @returns {string}
 */
function buildRouteIdentifier(route) {
	let id =
		'_' +
		route.segments
			.join('_')
			// remove any non-alphanumeric characters
			.replace(/[^a-zA-Z0-9_]/g, '');
	if (id === '') {
		id = '_';
	}
	return id;
}

/**
 * @param {import('../private.d.ts').Route} route
 * @returns {[id: string, node: ts.Node]}
 */
export function defineStaticRoute(route) {
	const id = buildRouteIdentifier(route);
	return [
		id,
		factory.createVariableDeclarationList(
			[
				factory.createVariableDeclaration(
					factory.createIdentifier(id),
					undefined,
					undefined,
					factory.createArrowFunction(
						undefined,
						undefined,
						[],
						undefined,
						factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
						factory.createStringLiteral(route.path),
					),
				),
			],
			ts.NodeFlags.Const,
		),
	];
}

/**
 * @param {import('../private.d.ts').Route} route
 * @returns {[id: string, node: ts.Node]}
 */
export function defineDynamicRoute(route) {
	const id = buildRouteIdentifier(route);
	if (!route.params) {
		throw new Error('Dynamic route must have params');
	}

	const literal = route.segments.slice(0, route.params[0].position).join('/');
	const head = factory.createTemplateHead(literal ? `/${literal}` : '');

	/** @type {import('typescript').TemplateSpan[]} */
	const spans = [];
	/** @type {import('typescript').VariableStatement[]} */
	const vars = [];
	for (let i = 0; i < route.params.length; i++) {
		const param = route.params[i];
		const varNameForParam = '_' + param.name;

		// resolve each param to a variable
		vars.push(
			factory.createVariableStatement(
				undefined,
				factory.createVariableDeclarationList(
					[
						factory.createVariableDeclaration(
							factory.createIdentifier(varNameForParam),
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

		// add to returned template literal
		const identifier = factory.createIdentifier(varNameForParam);
		const nextI = i + 1;
		if (nextI < route.params.length) {
			const literal = route.segments
				.slice(param.position + 1, route.params[nextI].position)
				.join('/');
			const middle = factory.createTemplateMiddle(literal ? `/${literal}` : '/');
			spans.push(factory.createTemplateSpan(identifier, middle));
		} else {
			const literal = route.segments.slice(param.position + 1).join('/');
			const tail = factory.createTemplateTail(literal ? `/${literal}` : '');
			spans.push(factory.createTemplateSpan(identifier, tail));
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
						[...vars, factory.createReturnStatement(factory.createTemplateExpression(head, spans))],
						true,
					),
				),
			),
		],
		ts.NodeFlags.Const,
	);

	const fields = route.params.map((p) => `${p.name}${p.required ? '' : '?'}: string;`).join(' ');
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
 * @returns {ts.Node[]}
 */
export function exportRoutePathTypeDef(dynamicPaths, staticPaths) {
	return [
		exportUnionStringLiteralTypeDef('DynamicRoutePath', dynamicPaths),
		exportUnionStringLiteralTypeDef('StaticRoutePath', staticPaths),
		factory.createTypeAliasDeclaration(
			[factory.createToken(ts.SyntaxKind.ExportKeyword)],
			factory.createIdentifier('RoutePath'),
			undefined,
			factory.createUnionTypeNode([
				factory.createTypeReferenceNode(factory.createIdentifier('DynamicRoutePath'), undefined),
				factory.createTypeReferenceNode(factory.createIdentifier('StaticRoutePath'), undefined),
			]),
		),
	];
}

/**
 * @param {import('typescript').Node[]} nodes
 * @returns {string}
 */
export function print(nodes) {
	const doc = factory.createJSDocComment(
		'DO NOT EDIT! This file is generated by vite-plugin-sveltevietnam-routes',
		undefined,
	);

	const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
	const resultFile = ts.createSourceFile(
		'temp.ts',
		'',
		ts.ScriptTarget.Latest,
		false,
		ts.ScriptKind.JS,
	);

	let code = printer.printList(
		ts.ListFormat.MultiLine,
		factory.createNodeArray([doc, newline(), ...nodes]),
		resultFile,
	);

	return code;
}

/**
 * @param {[identifier: string, literal: string][]} def
 * @returns {ts.Node}
 */
export function exportIdentifierAsLiterals(def) {
	return factory.createExportDeclaration(
		undefined,
		false,
		factory.createNamedExports(
			def.map(([identifier, literal]) =>
				factory.createExportSpecifier(
					false,
					factory.createIdentifier(identifier),
					factory.createStringLiteral(literal),
				),
			),
		),
		undefined,
		undefined,
	);
}
