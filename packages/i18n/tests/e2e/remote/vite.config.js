import { sveltekit } from '@sveltejs/kit/vite';
import { i18n } from '@sveltevietnam/i18n/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		i18n({
			input: '../lib/i18n/locales',
			output: './src/lib/i18n/generated',
			mode: 'remote',
		}),
		sveltekit(),
	],
});
