import child_process from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex, defineMDSveXConfig } from 'mdsvex';

import pkg from './package.json' assert { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();

const mdsvexConfig = defineMDSveXConfig({
  extensions: ['.md.svelte'],
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
  kit: {
    adapter: adapter({
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
      $3rd: path.resolve(__dirname, 'src/lib/3rd'),
      $client: path.resolve(__dirname, 'src/lib/client'),
      $server: path.resolve(__dirname, 'src/lib/server'),
      $shared: path.resolve(__dirname, 'src/lib/shared'),
    },
  },
  vitePlugin: {
    inspector: {
      toggleKeyCombo: 'control-shift',
      holdMode: true,
      showToggleButton: 'always',
      toggleButtonPos: 'bottom-left',
    },
  },
};

export default config;
