import path from 'path';
import { fileURLToPath } from 'url';

import inlineSvg from '@svelte-put/preprocess-inline-svg';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    vitePreprocess(),
    inlineSvg({
      directories: [path.resolve(__dirname, 'src/lib/shared/assets/images/svg')],
      inlineSrcAttributeName: 'inline-src',
      attributes: {
        height: 24,
        width: 24,
      },
    }),
  ],
  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
    }),
    alias: {
      $routes: path.resolve(__dirname, 'src/routes'),
      $client: path.resolve(__dirname, 'src/lib/client'),
      $server: path.resolve(__dirname, 'src/lib/server'),
      $shared: path.resolve(__dirname, 'src/lib/shared'),
    },
  },
  vitePlugin: {
    experimental: {
      inspector: {
        toggleKeyCombo: 'control-shift',
        holdMode: true,
        showToggleButton: 'always',
        toggleButtonPos: 'bottom-left',
      },
    },
  },
};

export default config;
