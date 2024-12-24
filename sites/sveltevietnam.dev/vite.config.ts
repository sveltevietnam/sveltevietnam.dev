import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcssVite from '@tailwindcss/vite';
import postcssColorScheme from 'postcss-color-scheme';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomSelectors from 'postcss-custom-selectors';
import { defineConfig } from 'vite';

export default defineConfig({
	css: {
		transformer: 'postcss',
		postcss: {
			plugins: [
				postcssCustomMedia(),
				postcssCustomSelectors(),
				postcssColorScheme({ name: 'media' }),
			],
		},
	},
	plugins: [enhancedImages(), sveltekit(), tailwindcssVite()],
});
