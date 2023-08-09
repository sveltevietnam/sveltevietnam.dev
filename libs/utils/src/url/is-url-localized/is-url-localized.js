/**
 * Check if a url is localized
 * @param {URL | string} url the url to check
 * @param {string | ReadonlyArray<string>} langs one or more languages to check
 * @returns {boolean}
 */
export function isUrlLocalized(url, langs) {
  /** @type {string} */
  let pathname;
  if (typeof url === 'string') {
    if (!url.startsWith('/')) {
      pathname = new URL(url).pathname;
    } else {
      pathname = url;
    }
  } else {
    pathname = url.pathname;
  }
  const langArray = Array.isArray(langs) ? langs : [langs];
  return langArray.some((lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`);
}
