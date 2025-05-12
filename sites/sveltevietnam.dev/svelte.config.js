import child_process from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import autoSlug from '@svelte-put/preprocess-auto-slug';
import externalLink from '@svelte-put/preprocess-external-link';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { markdown } from '@sveltevietnam/markdown';

import pkg from './package.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();

/** @type {import('@sveltejs/kit').Config} */
export default {
	extensions: ['.md.svelte', '.svelte'],
	preprocess: [
		markdown(),
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
		env: {
			publicPrefix: 'VITE_PUBLIC_',
			privatePrefix: 'VITE_PRIVATE_',
		},
		prerender: {
			origin: 'https://www.sveltevietnam.dev',
			crawl: true,
			handleHttpError: ({ path, message }) => {
				if (['/vi/not-found', '/en/not-found'].includes(path)) {
					return;
				}

				// otherwise fail the build
				throw new Error(message);
			},
		},
		adapter: adapter({
			config: path.join(__dirname, 'wrangler.json'),
			platformProxy: {
				configPath: path.join(__dirname, 'wrangler.json'),
			},
			routes: {
				include: ['/*'],
				exclude: [
					'<build>',
					'<files>',
					// prerendered static routes
					'/vi/tai-tro',
					'/en/sponsor',
					'/vi/quy-tac-ung-xu',
					'/vi/con-nguoi',
					'/en/code-of-conduct',
					'/vi/cai-dat',
					'/en/settings',
					'/vi/lo-trinh',
					'/en/roadmap',
					'/vi/thiet-ke',
					'/en/design',
					'/blue-screen-of-death',

					// prerendered dynamic routes
					'/vi/su-kien/20*',
					'/en/events/20*',
					'/en/blog/20*',
					'/vi/blog/20*',
				],
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
