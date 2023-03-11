import type { Config } from '@sveltejs/adapter-vercel';

import { VERCEL_ANALYTICS_ID } from '$env/static/private';
import { LOAD_DEPENDENCIES } from '$shared/constants';

import type { LayoutServerLoadEvent } from './$types';

export async function load({ url, locals, depends }: LayoutServerLoadEvent) {
  depends(LOAD_DEPENDENCIES.COLOR_SCHEME);

  return {
    pathname: url.pathname,
    vercelAnalyticsId: VERCEL_ANALYTICS_ID,
    colorScheme: locals.colorScheme,
    language: locals.language,
  };
}

export const config: Config = {
  runtime: 'edge',
};
