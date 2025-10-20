import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
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
