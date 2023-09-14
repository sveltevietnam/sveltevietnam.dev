import path from 'path';
import { fileURLToPath } from 'url';

import { inlineSvg } from '@svelte-put/preprocess-inline-svg/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    __BUILD_TIMESTAMP__: JSON.stringify(Date.now().toString()),
  },
};

export default config;
