import child_process from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

import autoSlug from '@svelte-put/preprocess-auto-slug';
import externalLink from '@svelte-put/preprocess-external-link';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import pkg from './package.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();

/** @type {import('@sveltejs/kit').Config} */
export default {
	extensions: ['.md.svelte', '.svelte'],
	preprocess: [
		externalLink(['www.sveltevietnam.dev', 'sveltevietnam.dev']),
		autoSlug((defaultOptions) => ({
			tags: ['h2', 'h3', 'h4', 'h5', 'h6'],
			files: ({ filename }) => {
				return filename?.endsWith('.md.svelte');
			},
			anchor: {
				content: '#',
				position: 'prepend',
				properties: {
					...defaultOptions.anchor.properties,
					class: 'heading-anchor',
				},
			},
		})),
		vitePreprocess(),
	],
	kit: {
		prerender: {
			origin: 'https://www.sveltevietnam.dev',
			crawl: true,
		},
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>'],
			},
		}),
		version: {
			name: `${pkg.version} (#${commitHash}@${Date.now()})`,
			// pollInterval: 10_000, // every 10 seconds
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
