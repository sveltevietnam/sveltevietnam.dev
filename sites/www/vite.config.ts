import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [enhancedImages(), sveltekit()],
	define: {
		__BUILD_TIMESTAMP__: JSON.stringify(Date.now().toString()),
	},
	optimizeDeps: {
		entries: ['./src/**/*.{svelte,js,ts}', '!**/*.md.svelte'],
	},
	server: {
		fs: {
			strict: false,
		},
	},
};

export default config;
