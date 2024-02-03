import child_process from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

import autoSlug from '@svelte-put/preprocess-auto-slug';
import inlineSvg from '@svelte-put/preprocess-inline-svg';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { enhanceCodeBlock } from '@sveltevietnam/ui/svelte/preprocessors/enhance-code-block';
import MagicString from 'magic-string';
import { mdsvex } from 'mdsvex';
import { walk } from 'svelte/compiler';
import { parse } from 'svelte-parse-markup';

import { mdsvexConfig } from './mdsvex.config.js';
import pkg from './package.json' assert { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();

/** @type {import('svelte/compiler').PreprocessorGroup} */
const externalLink = {
	markup(o) {
		const { content, filename } = o;
		const s = new MagicString(content);
		const ast = parse(content, { filename });

		walk(ast.html, {
			enter(node) {
				if (node.type === 'Element' && node.name === 'a') {
					let external = node.attributes.some((attr) => attr.name === 'external');
					if (!external) {
						const hrefAttr = node.attributes.find((attr) => attr.name === 'href');
						if (hrefAttr && hrefAttr.value?.[0]?.type === 'Text') {
							/** @type {string} */
							const href = hrefAttr.value[0]?.raw;
							try {
								if (href.startsWith('mailto')) {
									external = true;
								} else if (href.startsWith('http')) {
									const url = new URL(href);
									external = !['localhost', 'sveltevietnam.dev'].includes(url.hostname);
								}
							} catch (error) {
								/* */
							}
						}
					}

					const firstChild = node.children[0];
					if (external && firstChild) {
						let attrs = ' ';
						if (node.attributes.every((attr) => attr.name !== 'target')) attrs += 'target="_blank"';
						const relAttr = node.attributes.find((attr) => attr.name === 'rel');
						if (!relAttr) {
							attrs += 'rel="noreferrer noopener"';
						} else {
							const value = relAttr.value?.[0];
							if (value?.type === 'Text') {
								if (!value.raw.includes('noreferrer')) s.appendLeft(value.end, ' noreferrer');
								if (!value.raw.includes('noopener')) s.appendLeft(value.end, ' noopener');
							}
						}

						s.appendLeft(firstChild.start - 1, attrs);
					}
				}
			},
		});

		return {
			code: s.toString(),
			map: s.generateMap(),
		};
	},
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [
		mdsvex(mdsvexConfig),
		enhanceCodeBlock(),
		autoSlug((defaultOptions) => ({
			tags: ['h2', 'h3', 'h4', 'h5', 'h6'],
			files: ({ filename }) => {
				return filename.endsWith('.md.svelte');
			},
			anchor: {
				content: '#',
				position: 'prepend',
				properties: {
					...defaultOptions.anchor.properties,
					class: 'heading-anchor',
				},
			},
		})),
		externalLink,
		inlineSvg(
			[
				{
					directories: [path.resolve(__dirname, 'src/lib/assets/images/svg')],
					attributes: {
						height: '24',
						width: '24',
					},
				},
			],
			{
				inlineSrcAttributeName: 'inline-src',
				keepInlineSrcAttribute: true,
			},
		),
		vitePreprocess(),
	],
	kit: {
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>'],
			},
		}),
		version: {
			name: `${pkg.version} (#${commitHash}@${Date.now()})`,
			pollInterval: 10_000, // every 10 seconds
		},
		alias: {
			$routes: path.resolve(__dirname, 'src/routes'),
		},
	},
	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'alt-shift',
			holdMode: true,
			showToggleButton: 'always',
			toggleButtonPos: 'bottom-left',
		},
	},
};

export default config;
