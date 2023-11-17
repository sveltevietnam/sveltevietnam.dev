import { readFileSync } from 'fs';

import postcss from 'postcss';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssJs from 'postcss-js';
import postcssMixins from 'postcss-mixins';

import { mixins } from '../mixins/index.js';

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

require.extensions['.css'] = cssResolver;
