import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess()],
  kit: {
    adapter: adapter({
      edge: true,
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
