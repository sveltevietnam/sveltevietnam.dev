import ts, { factory } from 'typescript';

import { getIdFromMessageKey, getSourceMessageType } from '../utils.js';

// ===========
// Public API
// ===========
/**
 * @param {import('../../parser').SourceMessage} message
 * @param {string[]} langs
 * @returns {{ id: string, nodes: import('typescript').Node[] }}
 */
export function generateMessage(message, langs) {
	const { key } = message;
	const type = getSourceMessageType(message);
	const id = getIdFromMessageKey(key);

	let factoryName = 'createMessageSimple';
	if (type === 'with-params') {
		factoryName = 'createMessageWithParams';
	}

	const callExpression = factory.createCallExpression(
		factory.createIdentifier(factoryName),
		undefined,
		[
			factory.createStringLiteral(key),
			factory.createObjectLiteralExpression(
				langs
					.toSorted()
					.map((lang) =>
						factory.createPropertyAssignment(
							factory.createIdentifier(lang),
							factory.createElementAccessExpression(
								factory.createIdentifier(lang),
								factory.createStringLiteral(key),
							),
						),
					),
				true,
			),
		],
	);
	ts.addSyntheticLeadingComment(
		callExpression,
		ts.SyntaxKind.MultiLineCommentTrivia,
		'@__PURE__',
		false,
	);

	const node = factory.createVariableDeclarationList(
		[
			factory.createVariableDeclaration(
				factory.createIdentifier(id),
				undefined,
				undefined,
				callExpression,
			),
		],
		ts.NodeFlags.Const,
	);

	return { id, nodes: [node] };
}
