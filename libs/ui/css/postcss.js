import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssColorScheme from 'postcss-color-scheme';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssImport from 'postcss-import';
import postcssMixins from 'postcss-mixins';
import postcssNesting from 'postcss-nesting';
import tailwindcss from 'tailwindcss';
import tailwindCssNesting from 'tailwindcss/nesting/index.js';

export default {
	plugins: [
		postcssImport,
		tailwindCssNesting(postcssNesting),
		postcssCustomSelectors,
		postcssMixins(),
		tailwindcss,
		postcssColorScheme,
		autoprefixer,
		...(process.env.NODE_ENV !== 'development' ? [cssnano] : []),
	],
};
