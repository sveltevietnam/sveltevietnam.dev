import child_process from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

import autoSlug from '@svelte-put/preprocess-auto-slug';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex, defineMDSveXConfig } from 'mdsvex';
import remarkContainers from 'remark-containers';
import remarkGfm from 'remark-gfm';

import pkg from './package.json' assert { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();

const mdsvexConfig = defineMDSveXConfig({
  extensions: ['.md.svelte'],
  remarkPlugins: [remarkContainers, remarkGfm],
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [
    vitePreprocess(),
    mdsvex(mdsvexConfig),
    autoSlug((defaultOptions) => ({
      tags: ['h2', 'h3', 'h4', 'h5', 'h6'],
      files: ({ filename }) => {
        return filename.endsWith('.md.svelte');
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
  ],
  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
    }),
    version: {
      name: `${pkg.version} (#${commitHash}@${Date.now()})`,
      pollInterval: 10_000, // every 10 seconds
    },
    alias: {
      $routes: path.resolve(__dirname, 'src/routes'),
      $3rd: path.resolve(__dirname, 'src/lib/3rd'),
      $client: path.resolve(__dirname, 'src/lib/client'),
      $server: path.resolve(__dirname, 'src/lib/server'),
      $shared: path.resolve(__dirname, 'src/lib/shared'),
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

export default config;
