import { LOAD_DEPENDENCIES } from '$shared/constants';

import type { LayoutServerLoadEvent } from './$types';

export async function load({ url, locals, depends }: LayoutServerLoadEvent) {
  depends(LOAD_DEPENDENCIES.COLOR_SCHEME);

  return {
    pathname: url.pathname, // to trigger when pathname changes
    colorScheme: locals.colorScheme,
    language: locals.language,
    version: `#${__BUILD_HASH__}@${__BUILD_TIMESTAMP__}`,
  };
}
