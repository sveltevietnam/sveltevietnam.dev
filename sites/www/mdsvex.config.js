import { toString } from 'hast-util-to-string';
import { defineMDSveXConfig } from 'mdsvex';
import remarkContainers from 'remark-containers';
import remarkGfm from 'remark-gfm';
import { getHighlighterCore } from 'shikiji/core';
import loadWasm from 'shikiji/wasm';

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
	themes: [import('shikiji/themes/github-dark-dimmed.mjs')],
	langs: [
		import('shikiji/langs/javascript.mjs'),
		import('shikiji/langs/typescript.mjs'),
		import('shikiji/langs/svelte.mjs'),
		import('shikiji/langs/shellscript.mjs'),
		import('shikiji/langs/markdown.mjs'),
	],
	loadWasm,
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

const STATUSES = ['info', 'success', 'warning', 'error'];

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
			/** @typedef {{ type: 'highlight'; variant: typeof STATUSES[number]}} BlockHighlight */
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
					}

					// highlight
					if (!match) {
						match = str.match(new RegExp(`:::highlight\\s?(${STATUSES.join('|')})?`));
						if (match) {
							const variant = match[1] ?? 'info';
							blocks.push({ type: 'highlight', variant });
						}
					}

					if (!match) {
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
					let alreadyDiffed = false;
					for (let i = blocks.length - 1; i >= 0; i--) {
						const block = blocks[i];
						switch (block.type) {
							case 'diff':
								if (alreadyDiffed) continue;
								alreadyDiffed = true;
								line.properties['data-line-diff'] = block.variant;
								if (block.variant === '-') {
									shouldAddLineNumber = false;
									lineNumber--;
								}
								break;
							case 'highlight':
								line.properties['data-line-highlighted'] = block.variant;
								break;
						}
					}
				}
				if (shouldAddLineNumber) {
					line.properties['data-line'] = lineNumber;
				}
			}
		},
	};
}
