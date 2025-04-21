import ts, { factory } from 'typescript';

/**
 * @returns {ts.Node}
 */
export function importRerouteRuntime() {
	return factory.createImportDeclaration(
		undefined,
		factory.createImportClause(
			false,
			undefined,
			factory.createNamedImports([
				factory.createImportSpecifier(
					false,
					undefined,
					factory.createIdentifier('createRerouteFactory'),
				),
			]),
		),
		factory.createStringLiteral('@sveltevietnam/routes/runtime'),
		undefined,
	);
}

/**
 * @param {[localized: string, kit: string][]} mappings
 * @returns {ts.Node}
 */
export function defineRerouteStaticMappings(mappings) {
	const node = factory.createVariableStatement(
		undefined,
		factory.createVariableDeclarationList(
			[
				factory.createVariableDeclaration(
					factory.createIdentifier('staticMappings'),
					undefined,
					undefined,
					factory.createObjectLiteralExpression(
						mappings.map(([localized, kit]) =>
							factory.createPropertyAssignment(
								factory.createStringLiteral(localized),
								factory.createStringLiteral(kit),
							),
						),
						true,
					),
				),
			],
			ts.NodeFlags.Const,
		),
	);

	ts.addSyntheticLeadingComment(
		node,
		ts.SyntaxKind.MultiLineCommentTrivia,
		`*@type {Record<string, string>}`,
	);

	return node;
}

/**
 * @param {import('../../runtime/types.public.d.ts').DynamicMapping[]} mappings
 * @returns {ts.Node}
 */
export function defineRerouteDynamicMappings(mappings) {
	const node = factory.createVariableStatement(
		undefined,
		factory.createVariableDeclarationList(
			[
				factory.createVariableDeclaration(
					factory.createIdentifier('dynamicMappings'),
					undefined,
					undefined,
					factory.createArrayLiteralExpression(
						mappings.map(({ localized, paramPositions, kit }) =>
							factory.createObjectLiteralExpression(
								[
									factory.createPropertyAssignment(
										factory.createIdentifier('localized'),
										factory.createArrayLiteralExpression(
											localized.map((segment) => factory.createStringLiteral(segment)),
											false,
										),
									),
									factory.createPropertyAssignment(
										factory.createIdentifier('paramPositions'),
										factory.createArrayLiteralExpression(
											paramPositions.map((position) => factory.createNumericLiteral(position)),
											false,
										),
									),
									factory.createPropertyAssignment(
										factory.createIdentifier('kit'),
										factory.createArrayLiteralExpression(
											kit.map((segment) => factory.createStringLiteral(segment)),
											false,
										),
									),
								],
								true,
							),
						),
						true,
					),
				),
			],
			ts.NodeFlags.Const,
		),
	);

	ts.addSyntheticLeadingComment(
		node,
		ts.SyntaxKind.MultiLineCommentTrivia,
		`*@type {import('@sveltevietnam/routes/runtime').DynamicMapping[]}`,
	);

	return node;
}

/**
 * @returns {ts.Node}
 */
export function exportRerouteFactory() {
	return factory.createVariableStatement(
		[factory.createToken(ts.SyntaxKind.ExportKeyword)],
		factory.createVariableDeclarationList(
			[
				factory.createVariableDeclaration(
					factory.createIdentifier('createReroute'),
					undefined,
					undefined,
					factory.createCallExpression(
						factory.createIdentifier('createRerouteFactory'),
						undefined,
						[
							factory.createIdentifier('staticMappings'),
							factory.createIdentifier('dynamicMappings'),
						],
					),
				),
			],
			ts.NodeFlags.Const,
		),
	);
}
