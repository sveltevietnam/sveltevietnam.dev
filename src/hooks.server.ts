import type { Handle } from '@sveltejs/kit';
import * as cookie from 'cookie';

import { COOKIE_COLOR_SCHEME, COOKIE_LANGUAGE, COOKIE_USER_ID } from '$env/static/private';
import { LANGUAGES } from '$shared/constants';
import type { ColorScheme, Language } from '$shared/types';

export const handle: Handle = async ({ event, resolve }) => {
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');
  event.locals.userId = cookies[COOKIE_USER_ID] || crypto.randomUUID();
  event.locals.colorScheme = (cookies[COOKIE_COLOR_SCHEME] as ColorScheme) || 'system';

  let language = (cookies[COOKIE_LANGUAGE] as Language) || 'vi';
  for (const lang of LANGUAGES) {
    if (event.url.pathname === `/${lang}` || event.url.pathname.startsWith(`/${lang}/`)) {
      language = lang;
      break;
    }
  }
  event.locals.language = language;

  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html
        .replace('%cookie-color-scheme%', event.locals.colorScheme)
        .replace('%language%', event.locals.language),
  });

  return response;
};
