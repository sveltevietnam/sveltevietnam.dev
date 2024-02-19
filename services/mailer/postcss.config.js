import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';
import tailwindcss from 'tailwindcss';
import tailwindCssNesting from 'tailwindcss/nesting/index.js';

export default {
	plugins: [postcssImport, tailwindCssNesting(postcssNesting), tailwindcss, autoprefixer],
};
