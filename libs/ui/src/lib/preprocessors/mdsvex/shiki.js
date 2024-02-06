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
		import('shiki/langs/svelte.mjs'),
		import('shiki/langs/shellscript.mjs'),
		import('shiki/langs/markdown.mjs'),
	],
	loadWasm,
});

/**
 * @typedef CodeBlockMetadata
 * @property {string} __raw
 * @property {string} data-lang
 * @property {Record<string, string>} __enhancement
 */

/**
 * parse language and metadata from code block header in the format:
 * `language|key1="value1";key2="value2";...`
 *
 * Example: `svelte|key1="value1";array="1,2,3,4" ; ; blank=""; key2="with semicolon \; like that"`
 *
 * @param {string} str
 * @returns {{ lang: string; meta?: CodeBlockMetadata }}
 */
function parseLangAndMetadata(str) {
	/** @type {CodeBlockMetadata | undefined} */
	let meta;
	const [lang = 'svelte', metaStr] = str.split('|');
	if (metaStr) {
		meta = {
			__raw: metaStr,
			__enhancement: {},
			'data-lang': lang,
		};
		const propStrs = metaStr
			.trim()
			.split(/(?:\s*(?<!\/);?\s*)*([^"]+="[^"]*")/)
			.filter((seg) => !!seg);
		for (const propStr of propStrs) {
			const [, key, value] = propStr.split(/([^"]+)="([^"]*)"/);
			meta.__enhancement[key] = value;
		}
	}

	return {
		meta,
		lang,
	};
}

/**
 *
 * @param {string} code
 * @param {string} [langAndMetadataStr]
 */
export function highlighter(code, langAndMetadataStr = '') {
	const { lang, meta } = parseLangAndMetadata(langAndMetadataStr);
	const html = shiki.codeToHtml(code, {
		lang,
		themes: {
			light: 'light-plus',
			dark: 'dark-plus',
		},
		transformers: [transformer()],
		meta,
	});
	return escapeHtml(html);
}

const STATUSES = ['info', 'success', 'warning', 'error'];
/**
 * @returns {import('shiki').ShikiTransformer}
 */
function transformer() {
	return {
		name: '@sveltevietnam/ui:enhance-code-block',

		pre(hast) {
			delete hast.properties['tabindex'];

			const container = h('enhanced-code-block', [hast]);
			if (this.options.meta) {
				const metadata = /** @type {CodeBlockMetadata} */ (this.options.meta);
				for (const [key, value] of Object.entries(metadata.__enhancement)) {
					if (key === 'class') {
						this.addClassToHast(hast, value);
					}
					container.properties[key] = value;
				}
			}

			return container;
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
