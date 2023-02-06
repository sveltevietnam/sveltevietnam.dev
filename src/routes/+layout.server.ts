import { redirect } from '@sveltejs/kit';

import {
  COOKIE_COLOR_SCHEME,
  COOKIE_LANGUAGE,
  COOKIE_USER_ID,
  VERCEL_ANALYTICS_ID,
} from '$env/static/private';
import { LOAD_DEPENDENCIES } from '$shared/constants';

import type { LayoutServerLoad } from './$types';

const COOKIE_CONFIG = { path: '/', secure: true, httpOnly: true };

export const load: LayoutServerLoad = async ({ url, locals, depends, cookies }) => {
  depends(LOAD_DEPENDENCIES.COLOR_SCHEME);
  cookies.set(COOKIE_USER_ID, locals.userId, COOKIE_CONFIG);
  cookies.set(COOKIE_COLOR_SCHEME, locals.colorScheme, COOKIE_CONFIG);
  cookies.set(COOKIE_LANGUAGE, locals.language, COOKIE_CONFIG);

  if (!url.pathname.startsWith(`/${locals.language}`)) {
    throw redirect(302, `/${locals.language}${url.pathname}`);
  }
  return {
    pathname: url.pathname,
    vercelAnalyticsId: VERCEL_ANALYTICS_ID,
    colorScheme: locals.colorScheme,
    language: locals.language,
  };
};
