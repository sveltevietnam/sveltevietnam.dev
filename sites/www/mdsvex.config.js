import { defineMDSveXConfig } from 'mdsvex';
import remarkContainers from 'remark-containers';
import remarkGfm from 'remark-gfm';
import { getHighlighterCore } from 'shikiji/core';
import { getWasmInlined } from 'shikiji/wasm';

/**
 * Returns code with curly braces and backticks replaced by HTML entity equivalents
 * @param {string} html - highlighted HTML
 * @returns {string} - escaped HTML
 */
function escapeHtml(code) {
	return code.replace(
		/[{}`]/g,
		(character) => ({ '{': '&lbrace;', '}': '&rbrace;', '`': '&grave;' })[character],
	);
}

const shiki = await getHighlighterCore({
	themes: [
		// or a dynamic import if you want to do chunk splitting
		import('shikiji/themes/github-dark-dimmed.mjs'),
	],
	langs: [
		import('shikiji/langs/javascript.mjs'),
		import('shikiji/langs/typescript.mjs'),
		import('shikiji/langs/svelte.mjs'),
		import('shikiji/langs/diff.mjs'),
	],
	loadWasm: getWasmInlined,
});

export const mdsvexConfig = defineMDSveXConfig({
	extensions: ['.md.svelte'],
	remarkPlugins: [remarkContainers, remarkGfm],
	highlight: {
		async highlighter(code, lang) {
			const highlightLines = [];
			code = code.replace(/^\/\/\/\s*highlight:(.*)\s*\n/, (_, group) => {
				/** @type {string} */ (group)
					.trim()
					.split(',')
					.forEach((lineStr) => {
						lineStr = lineStr.trim().replace(/[^0-9-]/g, '');
						if (lineStr.includes('-')) {
							const [start, end] = lineStr.split('-');
							for (let line = Number(start.trim()); line <= Number(end.trim()); line++) {
								highlightLines.push(line);
							}
						} else {
							highlightLines.push(Number(lineStr));
						}
					});
				return '';
			});
			const html = shiki.codeToHtml(code, {
				lang,
				theme: 'github-dark-dimmed',
				transformers: [
					{
						line(node, line) {
							if (highlightLines.includes(line)) {
								node.properties['data-line-highlighted'] = true;
							}
							node.properties['data-line'] = line;
						},
					},
				],
			});
			return escapeHtml(html);
		},
	},
});
