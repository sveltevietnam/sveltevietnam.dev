import fs from 'fs';
import path from 'path';

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
	themes: [import('shiki/themes/dark-plus.mjs'), import('shiki/themes/light-plus.mjs')],
	langs: [
		import('shiki/langs/javascript.mjs'),
		import('shiki/langs/typescript.mjs'),
		import('shiki/langs/html.mjs'),
		import('shiki/langs/css.mjs'),
		import('shiki/langs/svelte.mjs'),
		import('shiki/langs/shellscript.mjs'),
		import('shiki/langs/markdown.mjs'),
	],
	loadWasm,
});

/** @type {Exclude<import('mdsvex').MdsvexOptions['highlight'], false>['highlighter']} */
export const highlighter = (code, lang = 'svelte', _meta, filename) => {
	const html = shiki.codeToHtml(code, {
		lang,
		themes: {
			light: 'light-plus',
			dark: 'dark-plus',
		},
		transformers: [transformer()],
		meta: {
			'data-lang': lang,
			__filename: filename,
		},
	});
	return escapeHtml(html);
};

/**
 * @typedef CodeBlockMetadata
 * @property {string} [__raw]
 * @property {string} [__filename]
 * @property {any} [__container]
 * @property {string} [data-lang]
 * @property {Record<string, string>} [__enhancement]
 */

/**
 * parse metadata from the meta lines at the top of code block
 * with format: `/// key=value` until there is no such line
 * @param {string} code
 * @param {Record<string, string>} meta
 * @returns {string}
 */
function parseMetadata(code, meta) {
	// get first line
	let newLineIndex = code.indexOf('\n');
	const line = code.slice(0, newLineIndex === -1 ? undefined : newLineIndex).trim();
	if (!line.startsWith('///')) return code;

	const metaStr = line.replace('///', '').trim();

	const match = metaStr.match(/(.*)(?<!\/)=(.*)/);
	if (match) meta[match[1].trim()] = match[2].trim();

	if (newLineIndex === -1) return code;

	return parseMetadata(code.slice(newLineIndex + 1), meta);
}

const STATUSES = ['info', 'success', 'warning', 'error'];
/**
 * @returns {import('shiki').ShikiTransformer}
 */
function transformer() {
	return {
		name: '@sveltevietnam/ui:enhance-code-block',
		preprocess(code) {
			/** @type {CodeBlockMetadata} */
			const meta = this.options.meta;
			if (!meta.__enhancement) meta.__enhancement = {};
			if (!('lang' in meta.__enhancement)) meta.__enhancement.lang = this.options.lang;
			code = parseMetadata(code, meta.__enhancement);
			if (meta.__enhancement.src && meta.__filename) {
				const srcPath = path.resolve(path.dirname(meta.__filename), meta.__enhancement.src);
				if (fs.existsSync(srcPath)) {
					code = fs.readFileSync(srcPath, 'utf-8');
				}
			}
			return code;
		},
		code(hast) {
			const meta = /** @type {CodeBlockMetadata} */ (this.options.meta);

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

				let shouldAddLineNumber = true;

				let isMetaLine = false;

				if (!meta.__enhancement?.skipMetaBlock) {
					const str = toString(line).trim();
					if (str.includes(':::')) {
						isMetaLine = true;

						// diff
						let match = str.match(/:::diff\s+([+-])(?![^\s])/);
						if (match) {
							const variant = /** @type {BlockDiff['variant']} */ (match[1]);
							blocks.push({ type: 'diff', variant });
						}

						// highlight
						if (!match) {
							match = str.match(new RegExp(`:::highlight\\s?(${STATUSES.join('|')})?(?![^\\s])`));
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
				}

				if (shouldAddLineNumber) {
					line.properties['data-line'] = lineNumber;
				}
			}

			this.pre.properties['data-num-lines'] = lineNumber;
			if (meta?.__enhancement) {
				meta.__enhancement.numLines = lineNumber.toString();
			}
		},
		pre(hast) {
			delete hast.properties['tabindex'];

			const container = h('enhanced-code-block', [hast]);
			const meta = /** @type {CodeBlockMetadata} */ (this.options.meta);
			if (meta?.__enhancement) {
				for (const [key, value] of Object.entries(meta.__enhancement)) {
					if (key === 'class') {
						this.addClassToHast(container, value);
						continue;
					}
					container.properties[key] = value;
				}
			}

			return container;
		},
	};
}
