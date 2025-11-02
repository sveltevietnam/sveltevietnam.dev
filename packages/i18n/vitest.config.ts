import { svelte } from '@sveltejs/vite-plugin-svelte';
import { playwright } from '@vitest/browser-playwright';
import type { Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

function mockRuntimeGeneratedModules(): Plugin {
	return {
		name: 'generated-modules',
		config() {
			return {
				build: {
					rollupOptions: {
						external: [
							'@sveltevietnam/i18n/generated/constants',
							'@sveltevietnam/i18n/generated/t.remote',
						],
					},
				},
			};
		},
		resolveId(id) {
			if (id === '@sveltevietnam/i18n/generated/constants') {
				return '@sveltevietnam/i18n/generated/constants';
			}
			if (id === '@sveltevietnam/i18n/generated/t.remote') {
				return '@sveltevietnam/i18n/generated/t.remote';
			}
		},
	};
}

export default defineConfig({
	plugins: [tsconfigPaths(), svelte()],
	test: {
		exclude: ['tests/e2e/**/test.ts'],
		projects: [
			{
				extends: true,
				plugins: [mockRuntimeGeneratedModules()],
				test: {
					name: 'runtime-ssr',
					environment: 'node',
					include: ['src/runtime/tests/**/ssr.test.svelte.ts'],
				},
			},
			{
				extends: true,
				plugins: [mockRuntimeGeneratedModules()],
				test: {
					name: 'runtime-browser',
					include: ['src/runtime/tests/**/browser.test.svelte.ts'],
					browser: {
						provider: playwright(),
						enabled: true,
						instances: [{ browser: 'chromium' }],
					},
				},
			},
			{
				extends: true,
				test: {
					name: 'buildtime',
					environment: 'node',
					include: ['**/*.test.ts', '**/test.ts'],
					exclude: ['**/*.test.svelte.ts'],
					server: {
						deps: {
							inline: ['import-meta-resolve'],
						},
					},
				},
			},
		],
		server: {
			deps: {
				inline: ['import-meta-resolve'],
			},
		},
		coverage: {
			provider: 'v8',
		},
	},
});
