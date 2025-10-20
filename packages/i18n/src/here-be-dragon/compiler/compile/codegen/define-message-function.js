import ts, { factory } from 'typescript';

import { chunkifyContentWithParams } from './chunkify-content-with-params';

/**
 * use {@link https://ts-ast-viewer.com | AST Viewer}
 * @param {import('../../../parser').Message} message
 * @returns {{ node: import('typescript').Node, id: string }}
 */
export function defineMessageFunction(message) {
	const { type, params, content, key } = message;
	const renderedContent = chunkifyContentWithParams(content, params);

	// avoiding conflict with reserved keywords,
	// just adding _ until there is a reliable upstream list
	// of all reserved keywords
	// @see https://github.com/microsoft/TypeScript/issues/2536
	const id = '_' + key.replace(/\./g, '_');

	const expression = factory.createParenthesizedExpression(
		factory.createArrowFunction(
			undefined,
			undefined,
			params.length
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
			factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
			renderedContent,
		),
	);

	if (type === 'with-params') {
		ts.addSyntheticLeadingComment(
			expression,
			ts.SyntaxKind.MultiLineCommentTrivia,
			`*@type {(params: Record<${params.map((p) => `"${p.name}"`).join('|')}, string>) => string}`,
			false,
		);
	}

	const factoryName = type === 'simple' ? 'createMessageSimple' : 'createMessageWithParams';
	const node = factory.createVariableStatement(
		[],
		factory.createVariableDeclarationList(
			[
				factory.createVariableDeclaration(
					factory.createIdentifier(id),
					undefined,
					undefined,
					factory.createCallExpression(factory.createIdentifier(factoryName), undefined, [
						factory.createStringLiteral(key),
						expression,
					]),
				),
			],
			ts.NodeFlags.Const,
		),
	);

	return { id, node };
}
