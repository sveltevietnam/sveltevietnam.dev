import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import { getHighlighterCore } from 'shiki/core';
import loadWasm from 'shiki/wasm';

/** @type {Record<string, string>} */
const ESCAPE_HTML_CHARACTER_MAP = {
	'{': '&lbrace;',
	'}': '&rbrace;',
	'`': '&grave;',
};

/**
 * Returns code with curly braces and backticks replaced by HTML entity equivalents
 * @param {string} html - highlighted HTML
 * @returns {string} - escaped HTML
 */
function escapeHtml(html) {
	return html.replace(/[{}`]/g, (character) => ESCAPE_HTML_CHARACTER_MAP[character]);
}

const shiki = await getHighlighterCore({
	themes: [import('shiki/themes/github-dark-dimmed.mjs')],
	langs: [
		import('shiki/langs/javascript.mjs'),
		import('shiki/langs/typescript.mjs'),
		import('shiki/langs/svelte.mjs'),
		import('shiki/langs/shellscript.mjs'),
		import('shiki/langs/markdown.mjs'),
	],
	loadWasm,
});

/**
 *
 * @param {string} code
 * @param {string} [lang]
 */
export function highlighter(code, lang) {
	const rLang = lang || 'svelte';
	const html = shiki.codeToHtml(code, {
		lang: rLang,
		theme: 'github-dark-dimmed',
		transformers: [transformer(rLang)],
	});
	return escapeHtml(html);
}

const STATUSES = ['info', 'success', 'warning', 'error'];
/**
 * @param {string} lang
 * @returns {import('shiki').ShikiTransformer}
 */
function transformer(lang) {
	return {
		root(hast) {
			return h('enhanced:codeblock', [hast]);
		},
		pre(hast) {
			hast.properties['data-lang'] = lang;
			delete hast.properties['tabindex'];
		},
		code(hast) {
			// FIXME: correct typing
			/** @type {any[]} */
			const lines = hast.children.filter((i) => i.type === 'element');
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
						const variant = /** @type {BlockDiff['variant']} */ (match[1]);
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
					const index = hast.children.indexOf(line);
					const lineAfter = hast.children.at(index + 1);
					if (lineAfter && lineAfter.type === 'text' && lineAfter.value === '\n') {
						hast.children.splice(index + 1, 1);
					}
					hast.children.splice(index, 1);

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
