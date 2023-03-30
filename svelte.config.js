import inlineSvg from '@svelte-put/preprocess-inline-svg';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    vitePreprocess(),
    inlineSvg({
      directories: ['src/lib/shared/assets/images/svg'],
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
      $routes: 'src/routes',
      $client: 'src/lib/client',
      $server: 'src/lib/server',
      $shared: 'src/lib/shared',
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
