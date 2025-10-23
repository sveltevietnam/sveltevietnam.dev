import ts, { factory } from 'typescript';

// ===========
// Public API
// ===========
/**
 * @param {string} id
 * @param {string[]} values
 * @param {boolean} [sorted=false]
 * @returns {ts.Node}
 */
export function generateStringArrayConstant(id, values, sorted) {
	const expression = factory.createParenthesizedExpression(
		factory.createArrayLiteralExpression(
			(sorted ? values.toSorted() : values).map((value) => factory.createStringLiteral(value)),
			false,
		),
	);
	ts.addSyntheticLeadingComment(
		expression,
		ts.SyntaxKind.MultiLineCommentTrivia,
		'*@type {const}',
		false,
	);
	const node = factory.createVariableStatement(
		[factory.createToken(ts.SyntaxKind.ExportKeyword)],
		factory.createVariableDeclarationList(
			[
				factory.createVariableDeclaration(
					factory.createIdentifier(id),
					undefined,
					undefined,
					expression,
				),
			],
			ts.NodeFlags.Const,
		),
	);
	return node;
}
