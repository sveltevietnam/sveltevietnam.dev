import { test, expect, describe } from 'vitest';

import { isUrlLocalized } from './is-url-localized';

const lang = 'en';
const langs = ['en', 'ja', 'vi'];
const differentLang = langs.filter((l) => l !== lang)[0];
const langsWithoutLang = langs.filter((l) => l !== lang);
const origin = 'https://mocking.com';

/**
 * @param {string} pathname
 */
function commonTests(pathname) {
	const localizedPathname = `/${lang}${pathname}`;

	const absoluteUrl = `${origin}${pathname}`;
	const localizedAbsoluteUrl = `${origin}/${lang}${pathname}`;

	const url = new URL(`${origin}${pathname}`);
	const localizedUrl = new URL(`${origin}${localizedPathname}`);

	describe('Checking single lang', () => {
		describe('arg is URL Object', () => {
			test('localized', () => {
				expect(isUrlLocalized(localizedUrl, lang)).toBe(true);
			});
			test('localized, but does not match arg', () => {
				expect(isUrlLocalized(localizedUrl, differentLang)).toBe(false);
			});
			test('not localized', () => {
				expect(isUrlLocalized(url, lang)).toBe(false);
			});
		});

		describe('arg is root relative pathname', () => {
			test('localized', () => {
				expect(isUrlLocalized(localizedPathname, lang)).toBe(true);
			});
			test('localized, but does not match arg', () => {
				expect(isUrlLocalized(localizedPathname, differentLang)).toBe(false);
			});
			test('not localized', () => {
				expect(isUrlLocalized(pathname, lang)).toBe(false);
			});
		});

		describe('arg is absolute url string', () => {
			test('localized', () => {
				expect(isUrlLocalized(localizedAbsoluteUrl, lang)).toBe(true);
			});
			test('localized, but does not match arg', () => {
				expect(isUrlLocalized(localizedAbsoluteUrl, differentLang)).toBe(false);
			});
			test('not localized', () => {
				expect(isUrlLocalized(absoluteUrl, lang)).toBe(false);
			});
		});
	});

	describe('Checking multiple langs', () => {
		describe('arg is URL Object', () => {
			test('localized', () => {
				expect(isUrlLocalized(localizedUrl, langs)).toBe(true);
			});
			test('localized, but does not match arg', () => {
				expect(isUrlLocalized(localizedUrl, langsWithoutLang)).toBe(false);
			});
			test('not localized', () => {
				expect(isUrlLocalized(url, langs)).toBe(false);
			});
		});

		describe('arg is root relative pathname', () => {
			test('localized', () => {
				expect(isUrlLocalized(localizedPathname, langs)).toBe(true);
			});
			test('localized, but does not match arg', () => {
				expect(isUrlLocalized(localizedPathname, langsWithoutLang)).toBe(false);
			});
			test('not localized', () => {
				expect(isUrlLocalized(pathname, langs)).toBe(false);
			});
		});

		describe('arg is absolute url string', () => {
			test('localized', () => {
				expect(isUrlLocalized(localizedAbsoluteUrl, langs)).toBe(true);
			});
			test('localized, but does not match arg', () => {
				expect(isUrlLocalized(localizedAbsoluteUrl, langsWithoutLang)).toBe(false);
			});
			test('not localized', () => {
				expect(isUrlLocalized(absoluteUrl, langs)).toBe(false);
			});
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
