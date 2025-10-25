import ts, { factory } from 'typescript';

import { print } from '../utils';

// ===========
// Public API
// ===========
/**
 * @param {string} mode
 * @returns {string}
 */
export function generateDts(mode) {
	const nodes = [
		factory.createImportDeclaration(
			undefined,
			factory.createImportClause(
				ts.SyntaxKind.TypeKeyword,
				undefined,
				factory.createNamespaceImport(factory.createIdentifier('m')),
			),
			factory.createStringLiteral('./messages'),
			undefined,
		),
		factory.createImportDeclaration(
			undefined,
			factory.createImportClause(
				ts.SyntaxKind.TypeKeyword,
				undefined,
				factory.createNamedImports([
					factory.createImportSpecifier(false, undefined, factory.createIdentifier('langs')),
				]),
			),
			factory.createStringLiteral('./constants'),
			undefined,
		),
		factory.createModuleDeclaration(
			[factory.createToken(ts.SyntaxKind.DeclareKeyword)],
			factory.createStringLiteral('@sveltevietnam/i18n-new/generated'),
			factory.createModuleBlock([
				factory.createInterfaceDeclaration(
					[factory.createToken(ts.SyntaxKind.ExportKeyword)],
					factory.createIdentifier('$$Runtime'),
					undefined,
					undefined,
					[
						factory.createCallSignature(
							undefined,
							[],
							factory.createTypeLiteralNode([
								factory.createPropertySignature(
									undefined,
									factory.createIdentifier('mode'),
									undefined,
									factory.createLiteralTypeNode(factory.createStringLiteral(mode)),
								),
								factory.createPropertySignature(
									undefined,
									factory.createIdentifier('mapping'),
									undefined,
									factory.createTypeQueryNode(factory.createIdentifier('m'), undefined),
								),
								factory.createPropertySignature(
									undefined,
									factory.createIdentifier('languages'),
									undefined,
									factory.createTypeQueryNode(factory.createIdentifier('langs'), undefined),
								),
							]),
						),
					],
				),
			]),
			ts.NodeFlags.ContextFlags,
		),
	];
	return print(nodes);
}
