import child_process from 'child_process';

import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

import pkg from './package.json';

const commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();

const config: UserConfig = {
  plugins: [sveltekit()],
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(Date.now()),
    __BUILD_HASH__: JSON.stringify(commitHash),
    __BUILD_VERSION__: JSON.stringify(pkg.version),
  },
};

export default config;
