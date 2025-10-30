// import path from 'path';

// import { inlineSvg } from '@svelte-put/inline-svg/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { css } from '@sveltevietnam/css/vite';
import { i18n } from '@sveltevietnam/i18n/vite';
import { routes } from '@sveltevietnam/routes/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';

import routesConfig from './src/data/routes/routes.config';

export default defineConfig({
	define: {
		__BUILD_TIMESTAMP__: JSON.stringify(Date.now()),
	},
	optimizeDeps: {
		/**
		 * pre-bundle in advance to prevent
		 * reloading on navigation during dev
		 * @see {@link https://github.com/sveltejs/kit/issues/11793}
		 */
		include: [
			'@floating-ui/dom',
			'@svelte-put/clickoutside',
			'@svelte-put/copy',
			'@svelte-put/qr',
			'@svelte-put/async-stack',
			'@svelte-put/async-stack/helpers',
			'@svelte-put/cloudflare-turnstile',
			'@svelte-put/lockscroll',
			'defu',
			'sveltekit-superforms',
			'sanitize-html',
			'valibot',
			'@lexical/dragon',
			'@lexical/extension',
			'@lexical/history',
			'@lexical/html',
			'@lexical/link',
			'@lexical/list',
			'@lexical/rich-text',
			'@lexical/selection',
			'@lexical/text',
			'@lexical/utils',
			'lexical',
			'lodash.debounce',
		],
	},
	plugins: [
		qrcode(),
		// inlineSvg(
		// 	[
		// 		{
		// 			directories: [path.resolve(__dirname, 'src/lib/assets/images/svg')],
		// 		},
		// 	],
		// 	{
		// 		inlineSrcAttributeName: 'inline-src',
		// 		typedef: true,
		// 	},
		// ),
		enhancedImages(),
		css(),
		tailwindcss(),
		i18n({
			input: 'src/lib/i18n/locales',
			output: 'src/lib/i18n/generated',
		}),
		routes(routesConfig),
		sveltekit(),
	],
	server: {
		fs: {
			strict: false,
		},
	},
});
