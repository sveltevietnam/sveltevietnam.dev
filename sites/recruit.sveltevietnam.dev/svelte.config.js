import child_process from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import externalLink from '@svelte-put/preprocess-external-link';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import pkg from './package.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [
		externalLink({
			hosts: ['recruit.sveltevietnam.dev'],
			attributes: {
				target: '_blank',
				rel: 'noopener noreferrer external',
			},
		}),
		vitePreprocess(),
	],
	kit: {
		env: {
			publicPrefix: 'VITE_PUBLIC_',
			privatePrefix: 'VITE_PRIVATE_',
		},
		adapter: adapter({
			config: path.join(__dirname, 'wrangler.json'),
			platformProxy: {
				configPath: path.join(__dirname, 'wrangler.json'),
			},
			routes: {
				include: ['/*'],
				exclude: ['<all>'],
			},
		}),
		version: {
			name: `${pkg.version} (#${commitHash}@${Date.now()})`,
		},
		alias: {
			$routes: path.resolve(__dirname, 'src/routes'),
			$data: path.resolve(__dirname, 'src/data'),
		},
	},
	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'alt-shift',
			holdMode: true,
			showToggleButton: 'always',
			toggleButtonPos: 'bottom-left',
		},
	},
};
