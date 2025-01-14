import MagicString from 'magic-string';
import { parse } from 'svelte-parse-markup';
import { walk } from 'zimmerframe';

/**
 * @typedef ComponentDefinition
 * @property {string} name - name of the component
 * @property {string} path - path to import component
 * @property {boolean} default - whether should import component from default export of module
 */

/**
 * @typedef ComponentsConfig
 * @property {ComponentDefinition} [one] - component for single code block
 * @property {ComponentDefinition} [group] - component for group of code blocks
 */

/**
 * @typedef EnhanceCodeBlockConfig
 * @property {ComponentsConfig} [components] - components to use for code blocks
 * @property {string} [enhancedElement] - element name to search for and enhance. Default is `enhanced-code-block`
 */

const DEFAULT_CONFIG =
	/** @satisfies {Required<EnhanceCodeBlockConfig> & { components: Required<ComponentsConfig>}} */ ({
		components: {
			one: {
				name: 'EnhancedCodeBlock',
				path: '@sveltevietnam/markdown/CodeBlock.svelte',
				default: true,
			},
			group: {
				name: 'EnhancedCodeBlockGroup',
				path: '@sveltevietnam/markdown/CodeBlockGroup.svelte',
				default: true,
			},
		},
		enhancedElement: 'enhanced-code-block',
	});

/**
 * @param {string} content
 * @param {EnhanceCodeBlockConfig} [config]
 * @returns {MagicString}
 */
export function enhanceCodeBlock(content, config = {}) {
	const s = new MagicString(content);

	const { components, enhancedElement } = {
		...DEFAULT_CONFIG,
		...config,
		components: {
			...DEFAULT_CONFIG.components,
			...config.components,
		},
	};

	const ast = parse(content, { modern: true });

	let isOneImported = new RegExp(`import\\s*{?\\s*${components.one.name}`).test(content);
	let isGroupImported = new RegExp(`import\\s*{?\\s*${components.group.name}`).test(content);

	/** @type {string[]} */
	const imports = [];
	/**
	 * @param {ComponentDefinition} component
	 */
	function addImport(component) {
		const nameSegment = component.default ? component.name : `{ ${component.name} }`;
		imports.push(`import ${nameSegment} from '${component.path}';`);
	}

	/**
	 * @param {any} node
	 * @param {ComponentDefinition} component
	 */
	function replaceNodeName(node, component) {
		s.update(node.start, node.start + enhancedElement.length + 1, '<' + component.name);

		s.update(node.end - enhancedElement.length - 1, node.end, component.name + '>');
	}

	walk(
		/** @type {import('svelte/compiler').AST.RegularElement} */ (
			/** @type {unknown} */ (ast.fragment)
		),
		null,
		{
			RegularElement(node, { next }) {
				if (node.name !== enhancedElement) return next();

				const attributes = /** @type {import('svelte/compiler').AST.Attribute[]} */ (
					node.attributes.filter((attr) => attr.type === 'Attribute')
				);

				const grouped = attributes.some((attr) => attr.name === 'group');

				if (grouped) {
					let additionalAttributes = '';

					// process "cols" attribute
					const colsAttr = attributes.find((attr) => attr.name === 'cols');
					if (!colsAttr) {
						const codeBlockChildren = node.fragment.nodes.filter(
							(n) =>
								(n.type === 'Component' && n.name === components.one.name) ||
								(n.type === 'RegularElement' && n.name === enhancedElement),
						);
						additionalAttributes = ` cols={${codeBlockChildren.length}}`;
					}

					// process "name" attribute
					const nameAttr = attributes.find((attr) => attr.name === 'name');
					if (!nameAttr) {
						let id = '';
						if ('crypto' in globalThis && crypto?.randomUUID) {
							id = crypto.randomUUID();
						} else {
							id = Math.random().toString(36).slice(2);
						}
						additionalAttributes += ` name="${id}"`;
					}

					s.appendLeft(node.start + enhancedElement.length, additionalAttributes);

					replaceNodeName(node, components.group);
					if (isGroupImported) return next();
					addImport(components.group);
					isGroupImported = true;
				} else {
					replaceNodeName(node, components.one);
					if (isOneImported) return next();
					addImport(components.one);
					isOneImported = true;
				}

				return next();
			},
		},
	);

	if (imports.length) {
		const importStatement = '\n' + imports.join('\n') + '\n';
		if (ast.module) {
			s.appendLeft(/** @type {any} */ (ast.module.content).start, importStatement);
		} else if (ast.instance) {
			s.appendLeft(/** @type {any} */ (ast.instance.content).start, importStatement);
		} else {
			s.append(`<script>${importStatement}</script>`);
		}
	}

	return s;
}
