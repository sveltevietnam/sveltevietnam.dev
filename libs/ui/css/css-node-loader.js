import { readFileSync } from 'fs';
import Module from 'node:module';

import postcss from 'postcss';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssJs from 'postcss-js';
import postcssMixins from 'postcss-mixins';

import { mixins } from './mixins.js';

/**
 *
 * @param {import('node:module')} module
 * @param {string} filename
 */
function cssResolver(module, filename) {
	const css = readFileSync(filename, 'utf8');
	const root = postcss.parse(css);
	// apply mixins & custom-selectors here so that
	// tailwind can pick up the correct selectors for intellisense
	const jss = postcssJs.sync([postcssMixins({ mixins }), postcssCustomSelectors])(
		postcssJs.objectify(root),
	);
	module.exports = jss;
}

/**
 * @param {string} path - should be import.meta.url
 */
export function createRequire(path) {
	const require = Module.createRequire(path);
	require.extensions['.css'] = cssResolver;
	return require;
}
