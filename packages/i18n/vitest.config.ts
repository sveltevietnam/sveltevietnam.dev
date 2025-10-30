import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		include: ['**/*.test.ts', '**/test.ts'],
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
