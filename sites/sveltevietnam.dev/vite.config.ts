import path from 'path';

import { inlineSvg } from '@svelte-put/inline-svg/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { i18n } from '@sveltevietnam/i18n/vite';
import tailwindcss from '@tailwindcss/vite';
import postcssColorScheme from 'postcss-color-scheme';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomSelectors from 'postcss-custom-selectors';
import { defineConfig } from 'vite';

import { sveltekitRouting } from './src/lib/routing/vite-plugin.js';

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
	plugins: [
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
				typedef: true,
			},
		),
		enhancedImages(),
		tailwindcss(),
		sveltekit(),
		sveltekitRouting(),
		i18n(),
	],
});
