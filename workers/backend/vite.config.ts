import fs from 'node:fs/promises';
import path from 'node:path';

import { cloudflare } from '@cloudflare/vite-plugin';
import mjmlParse from 'mjml';
import { defineConfig } from 'vite';

function mjml(config: Parameters<typeof import('mjml')>[1]): import('vite').Plugin {
	return {
		enforce: 'pre',
		name: 'vite-plugin-mjml',

		async load(id) {
			if (!id.endsWith('.mjml')) return null;
			const mjml = await fs.readFile(id, 'utf-8');
			const { html } = mjmlParse(mjml, {
				filePath: id,
				...config,
			});
			return 'export default ' + JSON.stringify(html);
		},
	};
}

export default defineConfig({
	plugins: [cloudflare(), mjml({ beautify: false })],
	resolve: {
		alias: {
			$: path.resolve(__dirname, './src'),
		},
	},
});
