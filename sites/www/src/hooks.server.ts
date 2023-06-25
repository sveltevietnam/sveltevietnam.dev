import type { Handle } from '@sveltejs/kit';

import { COOKIE_LANGUAGE, COOKIE_USER_ID } from '$env/static/private';
import { PUBLIC_COOKIE_SCHEME } from '$env/static/public';
import { getLocaleFromUrl, localizeUrl } from '$shared/services/i18n';
import type { ColorScheme } from '$shared/types';

const COMMON_COOKIE_CONFIG = { path: '/', secure: true, httpOnly: true };

export const handle: Handle = async ({ event, resolve }) => {
  const { locals, cookies, url, route, platform } = event;

  // Ensure that the user has a unique ID
  locals.userId = cookies.get(COOKIE_USER_ID) || crypto.randomUUID();
  cookies.set(COOKIE_USER_ID, locals.userId, COMMON_COOKIE_CONFIG);

  // return as is if fetching api routes
  if (route.id?.includes('(api)')) {
    return resolve(event);
  }
  let languageFromUrl = getLocaleFromUrl(url);

  if (!languageFromUrl) {
    // REF: https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
    const countryCode = platform?.cf?.country;
    if (countryCode && countryCode.toUpperCase() !== 'VN') {
      return Response.redirect(localizeUrl(url, 'en'), 302);
    }
    languageFromUrl = 'vi';
  }

  locals.colorScheme = (cookies.get(PUBLIC_COOKIE_SCHEME) as ColorScheme) || 'system';
  locals.language = languageFromUrl;

  // set cookies
  cookies.set(PUBLIC_COOKIE_SCHEME, locals.colorScheme, {
    ...COMMON_COOKIE_CONFIG,
    httpOnly: false,
  });
  cookies.set(COOKIE_LANGUAGE, locals.language, COMMON_COOKIE_CONFIG);

  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html
        .replace('%cookie-color-scheme%', event.locals.colorScheme)
        .replace('%language%', event.locals.language),
  });

  return response;
};
