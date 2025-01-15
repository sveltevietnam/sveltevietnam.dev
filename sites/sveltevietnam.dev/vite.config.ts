import path from 'path';

import { inlineSvg } from '@svelte-put/inline-svg/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { css } from '@sveltevietnam/css/vite';
import { i18n } from '@sveltevietnam/i18n/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import { sveltekitRouting } from './src/lib/routing/vite-plugin.js';

export default defineConfig({
	plugins: [
		inlineSvg(
			[
				{
					directories: [path.resolve(__dirname, 'src/lib/assets/images/svg')],
				},
			],
			{
				inlineSrcAttributeName: 'inline-src',
				typedef: true,
			},
		),
		enhancedImages(),
		css(),
		tailwindcss(),
		sveltekit(),
		sveltekitRouting(),
		i18n(),
	],
});
