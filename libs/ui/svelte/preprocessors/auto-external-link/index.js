import MagicString from 'magic-string';
import { walk } from 'svelte/compiler';
import { parse } from 'svelte-parse-markup';

/**
 * @public
 * @typedef AutoExternalLinkConfig
 * @property {string[]} hosts
 */

/**
 * @param {AutoExternalLinkConfig | AutoExternalLinkConfig['hosts']} config
 * @returns {import('svelte/compiler').PreprocessorGroup}
 */
export function autoExternalLink(config) {
	const rConfig = {
		hosts: ['localhost', ...(Array.isArray(config) ? config : config.hosts)],
		...(!Array.isArray ? config : {}),
	};
	return {
		markup(o) {
			const { content, filename } = o;
			const s = new MagicString(content);
			/** @type {any} */
			const ast = parse(content, { filename });

			walk(ast.html, {
				/**
				 * @param {any} node
				 * @returns
				 */
				enter(node) {
					if (node.type === 'Element' && node.name === 'a') {
						let external = node.attributes.some(
							(/** @type {{ name: string; }} */ attr) => attr.name === 'external',
						);
						if (!external) {
							const hrefAttr = node.attributes.find(
								(/** @type {{ name: string; }} */ attr) => attr.name === 'href',
							);
							if (hrefAttr && hrefAttr.value?.[0]?.type === 'Text') {
								/** @type {string} */
								const href = hrefAttr.value[0]?.raw;
								try {
									if (href.startsWith('mailto')) {
										external = true;
									} else if (href.startsWith('http')) {
										const url = new URL(href);
										external = !rConfig.hosts.includes(url.hostname);
									}
								} catch (error) {
									/* */
								}
							}
						}

						const firstChild = node.children[0];
						if (external && firstChild) {
							let attrs = ' ';
							if (
								node.attributes.every(
									(/** @type {{ name: string; }} */ attr) => attr.name !== 'target',
								)
							)
								attrs += 'target="_blank"';
							const relAttr = node.attributes.find(
								(/** @type {{ name: string; }} */ attr) => attr.name === 'rel',
							);
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
}
