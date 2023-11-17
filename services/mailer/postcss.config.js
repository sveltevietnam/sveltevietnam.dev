import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';
import tailwindcss from 'tailwindcss';
import tailwindCssNesting from 'tailwindcss/nesting/index.js';

/** @type {import('postcss-load-config').Config} */
export default {
	plugins: [
		postcssImport,
		tailwindCssNesting(postcssNesting),
		tailwindcss,
		autoprefixer,
		...(process.env.NODE_ENV !== 'development' ? [cssnano] : []),
	],
};
