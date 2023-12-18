import { toString } from 'hast-util-to-string';
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
		import('shikiji/langs/shellscript.mjs'),
		import('shikiji/langs/markdown.mjs'),
	],
	loadWasm: getWasmInlined,
});

/**
 *
 * @param {string} code
 * @param {string} [lang]
 */
async function highlighter(code, lang) {
	const html = shiki.codeToHtml(code, {
		lang,
		theme: 'github-dark-dimmed',
		transformers: [transformer()],
	});
	return escapeHtml(html);
}

export const mdsvexConfig = defineMDSveXConfig({
	extensions: ['.md.svelte'],
	remarkPlugins: [remarkContainers, remarkGfm],
	highlight: { highlighter },
});

/**
 * @returns {import('shikiji').ShikijiTransformer}
 */
function transformer() {
	return {
		pre(pre) {
			delete pre.properties['tabindex'];
		},
		code(code) {
			const lines = code.children.filter((i) => i.type === 'element');
			let lineNumber = 0;

			/** @typedef {{ type: 'diff'; variant: '-' | '+' }} BlockDiff */
			/** @typedef {{ type: 'highlight' }} BlockHighlight */
			/** @typedef {BlockDiff | BlockHighlight} Block */

			/** @type {Block[]} */
			const blocks = [];

			for (const line of lines) {
				lineNumber++;
				let isMetaLine = false;

				const str = toString(line).trim();
				if (str.includes(':::')) {
					isMetaLine = true;

					// diff
					let match = str.match(/:::diff\s+([+-])/);
					if (match) {
						const variant = match[1];
						blocks.push({ type: 'diff', variant });
					} else if (/:::highlight/.test(str)) {
						// highlight
						blocks.push({ type: 'highlight' });
					} else {
						blocks.pop();
					}
				}

				if (isMetaLine) {
					const index = code.children.indexOf(line);
					const lineAfter = code.children.at(index + 1);
					if (lineAfter && lineAfter.type === 'text' && lineAfter.value === '\n') {
						code.children.splice(index + 1, 1);
					}
					code.children.splice(index, 1);

					lineNumber--;
					continue;
				}

				let shouldAddLineNumber = true;
				if (blocks.length) {
					const block = blocks.at(-1);
					switch (block.type) {
						case 'diff':
							line.properties['data-line-diff'] = block.variant;
							if (block.variant === '-') {
								shouldAddLineNumber = false;
								lineNumber--;
							}
							break;
						case 'highlight':
							line.properties['data-line-highlighted'] = 'true';
							break;
					}
				}
				if (shouldAddLineNumber) {
					line.properties['data-line'] = lineNumber;
				}
			}
		},
	};
}
