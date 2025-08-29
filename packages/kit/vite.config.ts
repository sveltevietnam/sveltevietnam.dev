import { css } from '@sveltevietnam/css/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [css(), tailwindcss()],
});
