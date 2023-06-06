import child_process from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

import { inlineSvg } from '@svelte-put/preprocess-inline-svg/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

import pkg from './package.json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commitHash = child_process.execSync('git rev-parse --short HEAD').toString().trim();

const config: UserConfig = {
  plugins: [
    inlineSvg(
      [
        {
          directories: [path.resolve(__dirname, 'src/lib/shared/assets/images/svg')],
          attributes: {
            height: '24',
            width: '24',
          },
        },
      ],
      {
        inlineSrcAttributeName: 'inline-src',
        keepInlineSrcAttribute: true,
      },
    ),
    sveltekit(),
  ],
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(Date.now()),
    __BUILD_HASH__: JSON.stringify(commitHash),
    __BUILD_VERSION__: JSON.stringify(pkg.version),
  },
};

export default config;
