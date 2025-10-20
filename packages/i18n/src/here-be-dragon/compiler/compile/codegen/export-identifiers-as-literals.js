import { factory } from 'typescript';

/**
 * @param {Record<string, string>} def
 * @returns {import('typescript').Node}
 */
export function exportIdentifiersAsLiterals(def) {
	return factory.createExportDeclaration(
		undefined,
		false,
		factory.createNamedExports(
			Object.entries(def).map(([identifier, literal]) =>
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
