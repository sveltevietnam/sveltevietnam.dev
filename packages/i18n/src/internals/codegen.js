import ts, { factory } from 'typescript';

import { parseMessageParams } from './parse.js';
import * as utils from './utils.js';

export const newline = () => factory.createIdentifier('\n');

// TODO: add @__NO_SIDE_EFFECTS__

/**
 * @param {string} content
 * @param {import('./private.d.ts').MessageParameter[]} params
 * @param {boolean} [snippet] - whether processing for snippet (true) or function (false)
 * @returns {ts.TemplateLiteral | ts.StringLiteral | ts.PropertyAccessExpression | ts.Identifier}
 */
function chunkifyContentWithParams(content, params, snippet = false) {
	/** @type {ReturnType<typeof chunkifyContentWithParams>} */
	let node = factory.createStringLiteral('');

	/**
	 * Split a string with dynamic parameters into an array.
	 * For example:
	 *	 - input: 'some text {{param}}'
	 *	 - output: [{type: 'literal', content: 'some text '}, {type: 'identifier', content: 'param'}]
	 */
	/** @type {{type: 'identifier' | 'literal', content: string}[]} */
	const chunks = [];
	if (params.length === 0) {
		chunks.push({ type: 'literal', content });
	} else {
		let cursor = 0;
		for (let i = 0; i < params.length; i++) {
			const { start, end, name } = params[i];
			const literal = content.slice(cursor, start);
			if (literal) chunks.push({ type: 'literal', content: literal });
			chunks.push({ type: 'identifier', content: name });
			cursor = end;
		}

		if (cursor < content.length) {
			chunks.push({ type: 'literal', content: content.slice(cursor) });
		}
	}

	/**
	 * @param {string} param
	 * @returns {ts.PropertyAccessExpression | ts.Identifier}
	 */
	function referenceParam(param) {
		return snippet
			? factory.createPropertyAccessExpression(
					factory.createCallExpression(factory.createIdentifier('params'), undefined, []),
					factory.createIdentifier(param),
				)
			: factory.createIdentifier(param);
	}

	if (chunks.length === 1) {
		const { type, content } = chunks[0];
		if (type === 'literal') {
			node = factory.createStringLiteral(content);
		} else {
			node = referenceParam(content);
		}
	} else if (chunks.length > 1) {
		/** @type {ts.TemplateHead} */
		let head = factory.createTemplateHead('');
		/** @type {ts.TemplateSpan[]}*/
		let spans = [];

		let i = 0;
		while (i < chunks.length) {
			const { type, content } = chunks[i];

			// e.g. ^ literal [...] $
			if (type === 'literal') {
				head = factory.createTemplateHead(content, content);
				i++;
				continue;
			}

			const next = chunks[i + 1];

			// e.g. ^ [...] {{param1}} $
			if (!next) {
				spans.push(
					factory.createTemplateSpan(referenceParam(content), factory.createTemplateTail('')),
				);
				i++;
				continue;
			}

			// e.g. ^ [...] {{param1}} literal [...] $
			// or		^ [...] {{param1}} literal $
			if (next.type === 'literal') {
				const nextNext = chunks[i + 2];
				spans.push(
					factory.createTemplateSpan(
						referenceParam(content),
						!nextNext
							? factory.createTemplateTail(next.content)
							: factory.createTemplateMiddle(next.content),
					),
				);
				i += 2;
				continue;
			}

			// e.g. ^ [...] {{param1}}{{param2}} [...] $
			spans.push(
				factory.createTemplateSpan(referenceParam(content), factory.createTemplateMiddle('')),
			);
			i++;
		}

		node = factory.createTemplateExpression(head, spans);
	}

	return node;
}

/**
 * @param {boolean} proxy - whether to import `createMessageProxy`
 * @param {boolean} string - whether to import `createMessageString`
 * @param {boolean} func - whether to import `createMessageFunction`
 * @param {boolean} snippet - whether to import `createMessageSnippet`
 * @returns {ts.Node[]}
 */
export function importRuntimeFactoryFunctions(proxy, string, func, snippet) {
	/** @type {string[]} */
	const identifiers = [];

	if (proxy) {
		identifiers.push('createMessageProxy');
	}
	if (string) {
		identifiers.push('createMessageString');
	}
	if (func) {
		identifiers.push('createMessageFunction');
	}
	if (snippet) {
		identifiers.push('createMessageSnippet');
	}

	if (!identifiers.length) return [];

	return [
		factory.createImportDeclaration(
			undefined,
			factory.createImportClause(
				false,
				undefined,
				factory.createNamedImports(
					identifiers.map((id) =>
						factory.createImportSpecifier(false, undefined, factory.createIdentifier(id)),
					),
				),
			),
			factory.createStringLiteral('@sveltevietnam/i18n/runtime'),
			undefined,
		),
	];
}

/**
 * use {@link https://ts-ast-viewer.com | AST Viewer}
 * @param {string} key
 * @param {string} content
 * @returns {ts.Node[]}
 */
export function defineMessageString(key, content) {
	const node = factory.createVariableStatement(
		[],
		factory.createVariableDeclarationList(
			[
				factory.createVariableDeclaration(
					factory.createIdentifier(key),
					undefined,
					undefined,
					factory.createCallExpression(factory.createIdentifier('createMessageString'), undefined, [
						factory.createStringLiteral(content),
					]),
				),
			],
			ts.NodeFlags.Const,
		),
	);
	return [node];
}

/**
 * use {@link https://ts-ast-viewer.com | AST Viewer}
 * @returns {ts.Node[]}
 */
export function importSvelteSnippetUtil() {
	const node = factory.createImportDeclaration(
		undefined,
		factory.createImportClause(
			false,
			undefined,
			factory.createNamedImports([
				factory.createImportSpecifier(
					false,
					undefined,
					factory.createIdentifier('createRawSnippet'),
				),
			]),
		),
		factory.createStringLiteral('svelte'),
		undefined,
	);

	return [node];
}

/**
 * use {@link https://ts-ast-viewer.com | AST Viewer}
 * @param {string} key
 * @param {string} content
 * @param {import('./private.d.ts').MessageParameter[]} params
 * @returns {ts.Node[]}
 */
export function defineMessageFunction(key, content, params) {
	const renderedContent = chunkifyContentWithParams(content, params);

	const expression = factory.createParenthesizedExpression(
		factory.createArrowFunction(
			undefined,
			undefined,
			params.length
				? [
						factory.createParameterDeclaration(
							undefined,
							undefined,
							factory.createObjectBindingPattern(
								params.map((param) =>
									factory.createBindingElement(
										undefined,
										undefined,
										factory.createIdentifier(param.name),
										undefined,
									),
								),
							),
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

	ts.addSyntheticLeadingComment(
		expression,
		ts.SyntaxKind.MultiLineCommentTrivia,
		`*@type {(${params.length ? `params: Record<${params.map((p) => `"${p.name}"`).join('|')}, string>` : ''}) => string}`,
		false,
	);

	const node = factory.createVariableStatement(
		[],
		factory.createVariableDeclarationList(
			[
				factory.createVariableDeclaration(
					factory.createIdentifier(key),
					undefined,
					undefined,
					factory.createCallExpression(
						factory.createIdentifier('createMessageFunction'),
						undefined,
						[expression],
					),
				),
			],
			ts.NodeFlags.Const,
		),
	);

	return [node];
}

/**
 * use {@link https://ts-ast-viewer.com | AST Viewer}
 * @param {string} key
 * @param {string} content
 * @param {import('./private.d.ts').MessageParameter[]} params
 * @returns {ts.Node[]}
 */
export function defineMessageSnippet(key, content, params) {
	// if `content` is not an HTML element itself
	// e.g. `<element>...</element`
	// then wrap `content` in a `span` element
	if (!utils.isHtml(content)) {
		content = `<span>${content}</span>`;
		params = parseMessageParams(content);
	}

	const renderedContent = chunkifyContentWithParams(content, params, true);

	const expression = factory.createParenthesizedExpression(
		factory.createCallExpression(factory.createIdentifier('createRawSnippet'), undefined, [
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
				factory.createParenthesizedExpression(
					factory.createObjectLiteralExpression(
						[
							factory.createPropertyAssignment(
								factory.createIdentifier('render'),
								factory.createArrowFunction(
									undefined,
									undefined,
									[],
									undefined,
									factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
									renderedContent,
								),
							),
						],
						true,
					),
				),
			),
		]),
	);
	ts.addSyntheticLeadingComment(
		expression,
		ts.SyntaxKind.MultiLineCommentTrivia,
		`*@type {import('svelte').Snippet<[${params.length ? `params: Record<${params.map((p) => `"${p.name}"`).join('|')}, string>` : ''}]>}`,
		false,
	);

	const node = factory.createVariableStatement(
		[],
		factory.createVariableDeclarationList(
			[
				factory.createVariableDeclaration(
					factory.createIdentifier(key),
					undefined,
					undefined,
					factory.createCallExpression(
						factory.createIdentifier('createMessageSnippet'),
						undefined,
						[expression],
					),
				),
			],
			ts.NodeFlags.Const,
		),
	);

	return [node];
}

/**
 * @param {import('typescript').Node[]} nodes
 * @returns {string}
 */
export function print(nodes) {
	const doc = factory.createJSDocComment(
		'DO NOT EDIT! This file is generated by vite-plugin-sveltevietnam-i18n',
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
 * @param {Record<string, string>} def
 * @returns {ts.Node}
 */
export function exportIdentifierAsLiterals(def) {
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

/**
 * @param {string} varName - message variable name
 * @param {string[]} langs - languages
 * @returns {ts.Node}
 */
export function defineMessageProxy(varName, langs) {
	return factory.createVariableStatement(
		[],
		factory.createVariableDeclarationList(
			[
				factory.createVariableDeclaration(
					factory.createIdentifier(varName),
					undefined,
					undefined,
					factory.createCallExpression(factory.createIdentifier('createMessageProxy'), undefined, [
						factory.createObjectLiteralExpression(
							langs.map((lang) =>
								factory.createPropertyAssignment(
									factory.createIdentifier(lang),
									factory.createIdentifier(`${lang}${varName}`),
								),
							),
							true,
						),
					]),
				),
			],
			ts.NodeFlags.Const,
		),
	);
}
