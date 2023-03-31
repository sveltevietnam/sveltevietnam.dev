import { LOAD_DEPENDENCIES } from '$shared/constants';

import type { LayoutServerLoadEvent } from './$types';

export async function load({ url, locals, depends }: LayoutServerLoadEvent) {
  depends(LOAD_DEPENDENCIES.COLOR_SCHEME);

  return {
    pathname: url.pathname,
    colorScheme: locals.colorScheme,
    language: locals.language,
  };
}
