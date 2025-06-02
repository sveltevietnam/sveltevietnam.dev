import path from 'path';

import { inlineSvg } from '@svelte-put/inline-svg/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { css } from '@sveltevietnam/css/vite';
import { i18n } from '@sveltevietnam/i18n/vite';
import { routes } from '@sveltevietnam/routes/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';

import routesConfig from './src/data/routes/routes.config';
import { pagefind } from './src/lib/pagefind/vite';

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
			'@atproto/api',
			'@floating-ui/dom',
			'@svelte-put/lockscroll',
			'@svelte-put/toc',
			'@svelte-put/async-stack',
			'@svelte-put/qr',
			'@svelte-put/qr/svg',
			'@svelte-put/popover',
			'@svelte-put/copy',
			'@svelte-put/clickoutside',
			'@svelte-put/avatar',
			'@svelte-put/cloudflare-turnstile',
			'@svelte-put/inline-svg',
			'@svelte-put/shortcut',
			'animejs',
			'lodash.debounce',
			'sanitize-html',
			'sveltekit-superforms',
		],
	},
	plugins: [
		pagefind(),
		qrcode(),
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
		i18n({ input: 'src/**/locales' }),
		routes(routesConfig),
		sveltekit(),
	],
	server: {
		fs: {
			strict: false,
		},
	},
});
