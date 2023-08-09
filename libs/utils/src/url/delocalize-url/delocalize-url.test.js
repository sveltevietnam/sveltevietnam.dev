import { test, expect, describe } from 'vitest';

import { delocalizeUrl } from './delocalize-url';

const lang = 'en';
const langs = ['en', 'ja', 'vi'];

const origin = 'https://mocking.com';

/**
 * @param {string} pathname
 */
function commonTests(pathname) {
  const absoluteUrl = `${origin}${pathname}`;

  const localizedPathname = `/${lang}${pathname}`;

  const localizedAbsoluteUrl = `${origin}/${lang}${pathname}`;

  const url = new URL(`${origin}${pathname}`);
  const localizedUrl = new URL(`${origin}/${lang}${pathname}`);

  describe('localized', () => {
    test('arg is root relative pathname', () => {
      expect(delocalizeUrl(localizedPathname, langs)).toBe(pathname);
    });
    test('arg is absolute url string', () => {
      expect(delocalizeUrl(localizedAbsoluteUrl, langs)).toBe(absoluteUrl);
    });
    test('arg is URL object', () => {
      expect(delocalizeUrl(localizedUrl, langs).toString()).toBe(url.toString());
    });
  });

  describe('not localized', () => {
    test('arg is root relative pathname', () => {
      expect(delocalizeUrl(pathname, langs)).toBe(pathname);
    });
    test('arg is absolute url string', () => {
      expect(delocalizeUrl(absoluteUrl, langs)).toBe(absoluteUrl);
    });
    test('arg is URL object', () => {
      expect(delocalizeUrl(url, langs).toString()).toBe(url.toString());
    });
  });
}

describe('root urls', () => {
  commonTests('/');
});

describe('urls with subpaths', () => {
  commonTests('/path/to/somewhere');
});
