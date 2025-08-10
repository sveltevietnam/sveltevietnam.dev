import { defineConfig } from '../../eslint.config.js';

import svelteConfig from './svelte.config.js';

export default defineConfig(svelteConfig, [
	{
		languageOptions: {
			globals: {
				__BUILD_TIMESTAMP__: 'readonly',
			},
		},
	},
]);
