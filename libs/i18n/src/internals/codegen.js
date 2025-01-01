import dedent from 'dedent';
import recast from 'recast';
import ts, { factory } from 'typescript';

import * as utils from './utils.js';

export const newline = () => factory.createIdentifier('\n');

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
		for (let i = 0; i < content.length; i++) {
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
 * @param {boolean} string - whether to import `createMessageString`
 * @param {boolean} func - whether to import `createMessageFunction`
 * @param {boolean} snippet - whether to import `createMessageSnippet`
 * @returns {ts.Node[]}
 */
export function importRuntimeFactoryFunctions(string, func, snippet) {
	/** @type {string[]} */
	const identifiers = [];

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
			factory.createStringLiteral('@internals/i18n/runtime'),
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
export function exportMessageString(key, content) {
	const node = factory.createVariableStatement(
		[factory.createToken(ts.SyntaxKind.ExportKeyword)],
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
export function exportMessageFunction(key, content, params) {
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
		`*@type {(${params.length ? `params: Record<${params.map((p) => `"${p}"`).join('|')}, string>` : ''}) => string}`,
		false,
	);

	const node = factory.createVariableStatement(
		[factory.createToken(ts.SyntaxKind.ExportKeyword)],
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
export function exportMessageSnippet(key, content, params) {
	// if `content` is not an HTML element itself
	// e.g. `<element>...</element`
	// then wrap `content` in a `span` element
	if (!utils.isHtml(content)) {
		content = `<span>${content}</span>`;
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
		`*@type {import('svelte').Snippet<[${params.length ? `params: Record<${params.map((p) => `"${p}"`).join('|')}, string>` : ''}]>}`,
		false,
	);

	const node = factory.createVariableStatement(
		[factory.createToken(ts.SyntaxKind.ExportKeyword)],
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
 * @param {ReadonlyArray<string>} langs
 * @param {string} defaultLang
 * @returns {string}
 */
export function makeLoaderModule(langs, defaultLang) {
	const otherLangs = langs.filter((lang) => lang !== defaultLang).sort();
	const node = factory.createFunctionDeclaration(
		[
			factory.createToken(ts.SyntaxKind.ExportKeyword),
			factory.createToken(ts.SyntaxKind.AsyncKeyword),
		],
		undefined,
		factory.createIdentifier('loadLocale'),
		undefined,
		[
			factory.createParameterDeclaration(
				undefined,
				undefined,
				factory.createIdentifier('lang'),
				undefined,
				undefined,
				undefined,
			),
		],
		undefined,
		factory.createBlock(
			[
				...otherLangs.map((lang) =>
					factory.createIfStatement(
						factory.createBinaryExpression(
							factory.createIdentifier('lang'),
							factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
							factory.createStringLiteral(lang),
						),
						factory.createReturnStatement(
							factory.createAwaitExpression(
								factory.createCallExpression(
									/** @type {any} */ (factory.createToken(ts.SyntaxKind.ImportKeyword)),
									undefined,
									[factory.createStringLiteral(`./${lang}.js`)],
								),
							),
						),
						undefined,
					),
				),
				factory.createReturnStatement(
					factory.createAwaitExpression(
						factory.createCallExpression(
							/** @type {any} */ (factory.createToken(ts.SyntaxKind.ImportKeyword)),
							undefined,
							[factory.createStringLiteral(`./${defaultLang}.js`)],
						),
					),
				),
			],
			true,
		),
	);

	const loadFuncDoc = factory.createJSDocComment(dedent`
		@param {${langs.map((l) => `"${l}"`).join('|')}} lang
		@returns {Promise<typeof import('./${defaultLang}.js')>}
	`);

	const localeTypeDoc = factory.createJSDocComment(dedent`
		@typedef {typeof import('./${defaultLang}.js')} Locale
	`);

	return print([loadFuncDoc, node, newline(), localeTypeDoc]);
}

/**
 * @param {import('typescript').Node[]} nodes
 * @param {string} [lang]
 * @returns {string}
 */
export function print(nodes, lang = 'en') {
	const doc = factory.createJSDocComment(
		'DO NOT EDIT! This file is generated by vite-plugin-sveltekit-i18n',
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

	// workaround for https://github.com/microsoft/TypeScript/issues/36174
	if (lang !== 'en') {
		const ast = recast.parse(code);
		recast.types.visit(ast, {
			visitLiteral(path) {
				const node = path.node;
				if (typeof node.value === 'string') {
					path.replace(recast.types.builders.stringLiteral(node.value));
				}
				this.traverse(path);
			},
			visitTemplateElement(path) {
				const node = path.node;
				if (typeof node.value.raw === 'string') {
					path.replace(
						recast.types.builders.templateElement(
							{
								cooked: node.value.cooked,
								raw: node.value.cooked ?? node.value.raw,
							},
							node.tail,
						),
					);
				}
				this.traverse(path);
			},
		});

		code = recast.print(ast).code;
	}

	return code;
}
