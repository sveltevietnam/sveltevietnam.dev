// import path from 'path';

// import { inlineSvg } from '@svelte-put/inline-svg/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { css } from '@sveltevietnam/css/vite';
import { i18n } from '@sveltevietnam/i18n/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { qrcode } from 'vite-plugin-qrcode';

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
			'@svelte-put/clickoutside',
			'@svelte-put/async-stack',
			'@svelte-put/async-stack/helpers',
			'@svelte-put/cloudflare-turnstile',
			'sveltekit-superforms',
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
		i18n({ input: 'src/**/locales' }),
		sveltekit(),
	],
	server: {
		fs: {
			strict: false,
		},
	},
});
