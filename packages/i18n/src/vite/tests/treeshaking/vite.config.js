import { defineConfig } from 'vite';

import { i18n } from '../..';

export default defineConfig({
	logLevel: 'error',
	build: {
		minify: false,
		write: false,
	},
	plugins: [
		i18n({
			input: './i18n/locales',
			output: './i18n/generated',
			mode: 'static',
		}),
	],
});
