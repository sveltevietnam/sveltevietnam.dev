import type { Handle } from '@sveltejs/kit';

import { COOKIE_COLOR_SCHEME, COOKIE_LANGUAGE, COOKIE_USER_ID } from '$env/static/private';
import { LANGUAGES } from '$shared/constants';
import type { ColorScheme, Language } from '$shared/types';

const COOKIE_CONFIG = { path: '/', secure: true, httpOnly: true };

export const handle: Handle = async ({ event, resolve }) => {
  const { locals, request, cookies, url, route } = event;

  // Ensure that the user has a unique ID
  locals.userId = cookies.get(COOKIE_USER_ID) || crypto.randomUUID();
  cookies.set(COOKIE_USER_ID, locals.userId, COOKIE_CONFIG);

  // return as is if fetching api routes
  if (route.id?.includes('(api)')) {
    return resolve(event);
  }

  // REF: https://vercel.com/docs/concepts/edge-network/headers#x-vercel-ip-country
  // vercel specific country detection
  const countryCode = request.headers.get('x-vercel-ip-country');

  let language =
    (cookies.get(COOKIE_LANGUAGE) as Language) ||
    (countryCode?.toUpperCase() === 'VN' ? 'vi' : 'en');
  for (const lang of LANGUAGES) {
    if (url.pathname === `/${lang}` || url.pathname.startsWith(`/${lang}/`)) {
      language = lang;
      break;
    }
  }
  locals.language = language;

  if (
    !url.pathname.startsWith(`/${language}/`) &&
    !LANGUAGES.some((lang) => url.pathname === `/${lang}`)
  ) {
    return Response.redirect(
      `${url.origin}/${language}${url.pathname === '/' ? '' : url.pathname}`,
      302,
    );
  }

  locals.colorScheme = (cookies.get(COOKIE_COLOR_SCHEME) as ColorScheme) || 'system';

  // set cookies
  cookies.set(COOKIE_COLOR_SCHEME, locals.colorScheme, COOKIE_CONFIG);
  cookies.set(COOKIE_LANGUAGE, locals.language, COOKIE_CONFIG);

  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html
        .replace('%cookie-color-scheme%', event.locals.colorScheme)
        .replace('%language%', event.locals.language),
  });

  return response;
};
