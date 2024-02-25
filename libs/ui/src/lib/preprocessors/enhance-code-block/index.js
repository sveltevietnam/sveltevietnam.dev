import MagicString from 'magic-string';
import { walk } from 'svelte/compiler';
import { parse } from 'svelte-parse-markup';

/**
 * @public
 * @typedef ComponentDefinition
 * @property {string} name
 * @property {string} path
 * @property {boolean} default
 */

/**
 * @public
 * @typedef ComponentsConfig
 * @property {ComponentDefinition} [one]
 * @property {ComponentDefinition} [group]
 */

/**
 * @public
 * @typedef EnhanceCodeBlockConfig
 * @property {ComponentsConfig} [components]
 * @property {(filename?: string) => boolean} [files]
 * @property {string} [enhancedElement]
 */

/**
 * @internal
 * @type {Required<EnhanceCodeBlockConfig>}
 */
const DEFAULT_CONFIG = {
	components: {
		one: {
			name: 'EnhancedCodeBlock',
			path: '@sveltevietnam/ui/components/EnhancedCodeBlock.svelte',
			default: true,
		},
		group: {
			name: 'EnhancedCodeBlockGroup',
			path: '@sveltevietnam/ui/components/EnhancedCodeBlockGroup.svelte',
			default: true,
		},
	},
	files: (filename) => filename?.endsWith('.md.svelte') ?? false,
	enhancedElement: 'enhanced-code-block',
};

let globalCounter = 0;

/**
 * @param {EnhanceCodeBlockConfig} [config]
 * @returns {import('svelte/compiler').PreprocessorGroup}
 */
export function enhanceCodeBlock(config = {}) {
	const { components, enhancedElement, files } = {
		...DEFAULT_CONFIG,
		...config,
	};
	return {
		markup(o) {
			const { content, filename } = o;
			if (!files(filename)) return;

			const s = new MagicString(content);
			/** @type {any} */
			const ast = parse(content, { filename });

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

			walk(ast.html, {
				/**
				 * @param {any} node
				 * @returns
				 */
				enter(node) {
					if (node.type !== 'Element' || node.name !== enhancedElement) return;

					const grouped = node.attributes.some(
						(/** @type {{ name: string; }} */ attr) => attr.name === 'group',
					);

					if (grouped) {
						const codeBlockChildren = node.children.filter(
							(e) =>
								e.type === 'Element' &&
								(e.name === enhancedElement || e.name === components.one.name),
						);

						let additionalAttributes = ` cols=${codeBlockChildren.length}`;
						const nameAttr = node.attributes.find((attr) => attr.name === 'name');
						if (!nameAttr) {
							let uuid = (++globalCounter).toString();
							if (crypto?.randomUUID) {
								uuid = crypto.randomUUID();
							}
							additionalAttributes += ` name="${uuid}"`;
						}

						s.appendLeft(node.start + enhancedElement.length, additionalAttributes);

						replaceNodeName(node, components.group);
						if (isGroupImported) return;
						addImport(components.group);
						isGroupImported = true;
					} else {
						replaceNodeName(node, components.one);
						if (isOneImported) return;
						isOneImported = true;
						addImport(components.one);
					}
				},
			});

			if (imports.length) {
				const importStatement = imports.join('\n');
				if (ast.module) {
					s.appendLeft(ast.module.content.start, importStatement);
				} else if (ast.instance) {
					s.appendLeft(ast.instance.content.start, importStatement);
				} else {
					s.append(`<script>${importStatement}</script>`);
				}
			}

			return {
				code: s.toString(),
				map: s.generateMap(),
			};
		},
	};
}

export default enhanceCodeBlock;
