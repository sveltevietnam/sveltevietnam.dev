import child_process from 'child_process';

import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

import pkg from './package.json';

const commitHash = child_process.execSync('git rev-parse --short HEAD').toString();

const config: UserConfig = {
  plugins: [sveltekit()],
  define: {
    'process.env.BUILD_TIMESTAMP': JSON.stringify(Date.now()),
    'process.env.BUILD_HASH': JSON.stringify(commitHash),
    'process.env.BUILD_VERSION': JSON.stringify(pkg.version),
  },
};

export default config;
