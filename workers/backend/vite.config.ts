import path from 'node:path';

import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [cloudflare()],
	resolve: {
		alias: {
			$: path.resolve(__dirname, './src'),
		},
	},
});
