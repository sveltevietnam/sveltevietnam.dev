import { svelte } from '@sveltejs/vite-plugin-svelte';
import { playwright } from '@vitest/browser-playwright';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'node',
					environment: 'node',
					include: ['**/*.test.ts', '**/test.ts'],
					exclude: ['**/*.svelte.test.ts'],
					server: {
						deps: {
							inline: ['import-meta-resolve'],
						},
					},
				},
			},
			{
				extends: true,
				plugins: [svelte()],
				test: {
					name: 'browser',
					include: ['**/*.svelte.test.ts'],
					browser: {
						provider: playwright(),
						enabled: true,
						instances: [{ browser: 'chromium' }],
					},
				},
			},
		],
		coverage: {
			provider: 'v8',
		},
	},
});
