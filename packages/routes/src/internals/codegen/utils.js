import ts, { factory } from 'typescript';

export const newline = () => factory.createIdentifier('\n');

/**
 * @param {string[]} segments
 * @returns {string}
 */
export function buildRouteIdentifier(segments) {
	let id =
		'_' +
		segments
			.map((s) => s.normalize())
			.join('_')
			// remove any non-alphanumeric characters
			.replace(/[^a-zA-Z0-9_]/g, '');
	if (id === '') {
		id = '_';
	}
	return id;
}

/**
 * @param {ts.Node[]} nodes
 * @returns {string}
 */
export function print(nodes) {
	const doc = factory.createJSDocComment(
		'DO NOT EDIT! This file is generated with vite-plugin-sveltevietnam-routes',
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
