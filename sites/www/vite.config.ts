import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [sveltekit()],
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(Date.now().toString()),
  },
};

export default config;
