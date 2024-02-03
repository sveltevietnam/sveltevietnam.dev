import { readFileSync } from 'fs';
import Module from 'node:module';

import postcss from 'postcss';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssJs from 'postcss-js';
import postcssMixins from 'postcss-mixins';

import { mixins } from './mixins.js';

/**
 * @param {string} filename
 */
export function jssLoader(filename) {
	const css = readFileSync(filename, 'utf8');
	const root = postcss.parse(css);

	// apply mixins & custom-selectors here so that
	// tailwind can pick up the correct representation for intellisense
	const jss = postcssJs.sync([
		postcssMixins({ mixins }),
		/** @type {any} */ (postcssCustomSelectors),
	])(postcssJs.objectify(root));

	return jss;
}

/**
 * Custom node module resolver for css
 * @param {import('node:module')} module
 * @param {string} filename
 */
function jssModuleResolver(module, filename) {
	module.exports = jssLoader(filename);
}

/**
 * @param {string} path - should be import.meta.url
 */
export function createRequire(path) {
	const require = Module.createRequire(path);
	require.extensions['.css'] = jssModuleResolver;
	return require;
}
