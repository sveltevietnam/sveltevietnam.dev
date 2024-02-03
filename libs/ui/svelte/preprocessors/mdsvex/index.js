import { mdsvex as createPreprocessor } from 'mdsvex';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import remarkContainers from 'remark-containers';
import remarkGfm from 'remark-gfm';

import { highlighter } from './shiki.js';

export const mdsvexDefaultConfig = /** @satisfies {import('mdsvex').MdsvexOptions} */ ({
	extensions: ['.md.svelte'],
	remarkPlugins: [remarkContainers, remarkGfm],
	highlight: { highlighter },
});

/**
 * @param {import('mdsvex').MdsvexOptions} [config]
 * @returns {ReturnType<typeof createPreprocessor>}
 */
export function mdsvex(config) {
	return createPreprocessor({
		...mdsvexDefaultConfig,
		extensions: [...mdsvexDefaultConfig.extensions, ...(config?.extensions ?? [])],
		remarkPlugins: [...mdsvexDefaultConfig.remarkPlugins, ...(config?.remarkPlugins ?? [])],
		highlight: config?.highlight !== false && {
			...mdsvexDefaultConfig.highlight,
			...config?.highlight,
		},
	});
}
