import MagicString from 'magic-string';
import { walk } from 'svelte/compiler';
import { parse } from 'svelte-parse-markup';

/**
 * @public
 * @typedef EnhanceCodeBlockConfig
 * @property {{
 *   name: string;
 *   path: string;
 *   default?: boolean;
 * }} [component]
 * @property {(filename?: string) => boolean} [files]
 * @property {string} [element]
 */

/**
 * @internal
 * @type {Required<EnhanceCodeBlockConfig>}
 */
const DEFAULT_CONFIG = {
	component: {
		name: 'EnhancedCodeBlock',
		path: '@sveltevietnam/ui/components/EnhancedCodeBlock.svelte',
		default: true,
	},
	files: (filename) => filename?.endsWith('.md.svelte') ?? false,
	element: 'enhanced:codeblock',
};

/**
 * @param {EnhanceCodeBlockConfig} [config]
 * @returns {import('svelte/compiler').PreprocessorGroup}
 */
export function enhanceCodeBlock(config = {}) {
	const rConfig = {
		...DEFAULT_CONFIG,
		...config,
	};
	return {
		markup(o) {
			const { content, filename } = o;
			if (!rConfig.files(filename)) return;

			const s = new MagicString(content);
			/** @type {any} */
			const ast = parse(content, { filename });

			const importRegex = new RegExp(`import\\s*{?\\s*${rConfig.component.name}`);
			let isImported = importRegex.test(content);

			walk(ast.html, {
				/**
				 * @param {any} node
				 * @returns
				 */
				enter(node) {
					if (node.type !== 'Element' || node.name !== rConfig.element) return;

					s.update(
						node.start,
						node.start + rConfig.elemenrt.length + 1,
						'<' + rConfig.component.name,
					);

					s.update(node.end - rConfig.element.length - 1, node.end, rConfig.component.name + '>');

					if (isImported) return;

					const nameSegment = rConfig.component.default
						? rConfig.component.name
						: `{ ${rConfig.component.name} }`;
					const importStatement = `import ${nameSegment} from '${rConfig.component.path}';`;

					if (ast.module) {
						s.appendLeft(ast.module.content.start, importStatement);
					} else if (ast.instance) {
						s.appendLeft(ast.instance.content.start, importStatement);
					} else {
						s.append(`<script>${importStatement}</script>`);
					}
					isImported = true;
				},
			});

			return {
				code: s.toString(),
				map: s.generateMap(),
			};
		},
	};
}

export default enhanceCodeBlock;
