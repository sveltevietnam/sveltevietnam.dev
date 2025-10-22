import ts, { factory } from 'typescript';

// ===========
// Public API
// ===========
/**
 * Generate a JS message function for a single message
 * @param {import('../../parser').Message} message
 * @returns {{ nodes: ts.Node[], id: string }}
 */
export function generateMessageFunction(message) {
	const { params, content, key } = message;
	const renderedContent = chunkifyContentWithParams(content, params);

	// avoiding conflict with reserved keywords,
	// just adding _ until there is a reliable upstream list
	// of all reserved keywords
	// @see https://github.com/microsoft/TypeScript/issues/2536
	const id = '_' + key.replace(/\./g, '_');

	// ----------------
	// Create Function
	// ----------------
	const node = factory.createVariableStatement(
		[],
		factory.createVariableDeclarationList(
			[
				factory.createVariableDeclaration(
					factory.createIdentifier(id),
					undefined,
					undefined,
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
				),
			],
			ts.NodeFlags.Const,
		),
	);

	// ---------------
	// Generate JSDoc
	// ---------------
	/** @type {ts.JSDocTag[]} */
	const jsdocTags = [];
	if (params.length) {
		jsdocTags.push(
			factory.createJSDocParameterTag(
				undefined,
				factory.createIdentifier('params'),
				false,
				factory.createJSDocTypeExpression(
					factory.createTypeLiteralNode(
						params.map((param) =>
							factory.createPropertySignature(
								undefined,
								factory.createIdentifier(param.name),
								undefined,
								factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
							),
						),
					),
				),
			),
		);
	}
	jsdocTags.push(
		factory.createJSDocReturnTag(
			undefined,
			factory.createJSDocTypeExpression(factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)),
		),
		factory.createJSDocUnknownTag(factory.createIdentifier('__NO_SIDE_EFFECTS__')),
	);
	const comment = factory.createJSDocComment('', jsdocTags);

	return { id, nodes: [comment, node] };
}

// ==========
// Internals
// ==========
/**
 * @param {string} content
 * @param {import('../../parser/parse-message').MessageParameter[]} params
 * @returns {import('typescript').TemplateLiteral | import('typescript').StringLiteral | import('typescript').PropertyAccessExpression | import('typescript').Identifier}
 */
function chunkifyContentWithParams(content, params) {
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
		const flatParams = params
			.flatMap((param) =>
				param.positions.map((pos) => ({
					name: param.name,
					start: pos.start,
					end: pos.end,
				})),
			)
			.sort((a, b) => a.start - b.start);
		for (let i = 0; i < flatParams.length; i++) {
			const { start, end, name } = flatParams[i];
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
	 * @returns {import('typescript').PropertyAccessExpression}
	 */
	function referenceParam(param) {
		return factory.createPropertyAccessExpression(
			factory.createIdentifier('params'),
			factory.createIdentifier(param),
		);
	}

	if (chunks.length === 1) {
		const { type, content } = chunks[0];
		if (type === 'literal') {
			node = factory.createStringLiteral(content);
		} else {
			node = referenceParam(content);
		}
	} else if (chunks.length > 1) {
		/** @type {import('typescript').TemplateHead} */
		let head = factory.createTemplateHead('');
		/** @type {import('typescript').TemplateSpan[]}*/
		const spans = [];

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
