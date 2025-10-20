import { factory } from 'typescript';

/**
 * @param {string[]} ids
 * @returns {import('typescript').Node[]}
 */
export function importFactories(ids) {
	return [
		factory.createImportDeclaration(
			undefined,
			factory.createImportClause(
				false,
				undefined,
				factory.createNamedImports(
					ids.map((id) =>
						factory.createImportSpecifier(false, undefined, factory.createIdentifier(id)),
					),
				),
			),
			factory.createStringLiteral('@sveltevietnam/i18n/runtime/factory'),
			undefined,
		),
	];
}
