import { test, expect, describe } from 'vitest';

import { localizeUrl } from './localize-url';

const lang = 'en';
const langs = ['en', 'ja', 'vi'];
const differentLang = langs.filter((l) => l !== lang)[0];

const origin = 'https://mocking.com';

/**
 * @param {string} pathname
 */
function commonTests(pathname) {
  if (pathname === '/') pathname = '';
  const localizedPathname = `/${lang}${pathname}`;
  const differentLocalizedPathname = `/${differentLang}${pathname}`;

  const absoluteUrl = `${origin}${pathname}`;
  const localizedAbsoluteUrl = `${origin}/${lang}${pathname}`;
  const differentLocalizedAbsoluteUrl = `${origin}/${differentLang}${pathname}`;

  const url = new URL(`${origin}${pathname}`);
  const localizedUrl = new URL(`${origin}/${lang}${pathname}`);
  const differentLocalizedUrl = new URL(`${origin}/${differentLang}${pathname}`);

  describe('already localized', () => {
    test('arg is root relative pathname', () => {
      expect(localizeUrl(localizedPathname, lang, langs)).toBe(localizedPathname);
    });
    test('arg is absolute url string', () => {
      expect(localizeUrl(localizedAbsoluteUrl, lang, langs)).toBe(localizedAbsoluteUrl);
    });
    test('arg is URL object', () => {
      expect(localizeUrl(localizedUrl, lang, langs).toString()).toBe(localizedUrl.toString());
    });
  });

  describe('already localized but with different lang', () => {
    test('arg is root relative pathname', () => {
      expect(localizeUrl(differentLocalizedPathname, lang, langs)).toBe(localizedPathname);
    });
    test('arg is absolute url string', () => {
      expect(localizeUrl(differentLocalizedAbsoluteUrl, lang, langs)).toBe(localizedAbsoluteUrl);
    });
    test('arg is URL object', () => {
      expect(localizeUrl(differentLocalizedUrl, lang, langs).toString()).toBe(
        localizedUrl.toString(),
      );
    });
  });

  describe('not localized', () => {
    test('arg is root relative pathname', () => {
      expect(localizeUrl(pathname || '/', lang, langs)).toBe(localizedPathname);
    });
    test('arg is absolute url string', () => {
      expect(localizeUrl(absoluteUrl, lang, langs)).toBe(localizedAbsoluteUrl);
    });
    test('arg is URL object', () => {
      expect(localizeUrl(url, lang, langs).toString()).toBe(localizedUrl.toString());
    });
  });
}

describe('root urls', () => {
  commonTests('/');
});

describe('urls with subpaths', () => {
  commonTests('/path/to/somewhere');
});

describe('urls with subpaths, ending with slash', () => {
  commonTests('/path/to/somewhere/');
});
