import path from 'node:path';

import { defineConfig } from 'vite';

import { i18n } from '../..';

export default defineConfig({
	logLevel: 'error',
	plugins: [
		{
			name: 'vite-plugin-something',
			config() {
				return {
					resolve: {
						alias: {
							$components: path.join(import.meta.dirname, 'components'),
						},
					},
				};
			},
		},
		i18n({
			input: './i18n/locales',
			output: './i18n/generated',
			mode: 'static',
		}),
	],
});
