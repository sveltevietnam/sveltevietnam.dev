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
  const absoluteUrl = `${origin}${pathname}`;

  const localizedPathname = `/${lang}${pathname}`;
  const differentLocalizedPathname = `/${differentLang}${pathname}`;

  const localizedAbsoluteUrl = `${origin}/${lang}${pathname}`;
  const differentLocalizedAbsoluteUrl = `${origin}/${differentLang}${pathname}`;

  const url = new URL(`${origin}${pathname}`);
  const localizedUrl = new URL(`${origin}/${lang}${pathname}`);
  const differentLocalizedUrl = new URL(`${origin}/${differentLang}${pathname}`);

  describe('already localized', () => {
    test('arg is root relative pathname', () => {
      expect(localizeUrl(localizedPathname, langs, lang)).toBe(localizedPathname);
    });
    test('arg is absolute url string', () => {
      expect(localizeUrl(localizedAbsoluteUrl, langs, lang)).toBe(localizedAbsoluteUrl);
    });
    test('arg is URL object', () => {
      expect(localizeUrl(localizedUrl, langs, lang).toString()).toBe(localizedUrl.toString());
    });
  });

  describe('already localized but with different lang', () => {
    test('arg is root relative pathname', () => {
      expect(localizeUrl(differentLocalizedPathname, langs, lang)).toBe(localizedPathname);
    });
    test('arg is absolute url string', () => {
      expect(localizeUrl(differentLocalizedAbsoluteUrl, langs, lang)).toBe(localizedAbsoluteUrl);
    });
    test('arg is URL object', () => {
      expect(localizeUrl(differentLocalizedUrl, langs, lang).toString()).toBe(
        localizedUrl.toString(),
      );
    });
  });

  describe('not localized', () => {
    test('arg is root relative pathname', () => {
      expect(localizeUrl(pathname, langs, lang)).toBe(localizedPathname);
    });
    test('arg is absolute url string', () => {
      expect(localizeUrl(absoluteUrl, langs, lang)).toBe(localizedAbsoluteUrl);
    });
    test('arg is URL object', () => {
      expect(localizeUrl(url, langs, lang).toString()).toBe(localizedUrl.toString());
    });
  });
}

describe('root urls', () => {
  commonTests('/');
});

describe('urls with subpaths', () => {
  commonTests('/path/to/somewhere');
});
