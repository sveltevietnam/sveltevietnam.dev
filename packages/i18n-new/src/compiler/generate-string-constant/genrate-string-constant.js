import ts, { factory } from 'typescript';

// ===========
// Public API
// ===========
/**
 * @param {string} id
 * @param {string} value
 * @returns {ts.Node}
 */
export function generateStringConstant(id, value) {
	const expression = factory.createParenthesizedExpression(factory.createStringLiteral(value));
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
