import { defineConfig } from 'vite';

import { i18n } from '../..';

export default defineConfig({
	logLevel: 'warn',
	plugins: [
		i18n({
			input: './i18n/locales',
			output: './i18n/generated',
			mode: 'static',
		}),
	],
});
