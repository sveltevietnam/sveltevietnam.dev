import { test, expect, describe } from 'vitest';

import { getLangFromUrl } from './get-lang-from-url.js';

const lang = 'en';
const langs = ['en', 'ja', 'vi'];

/**
 * @param {string} pathname
 */
function commonTests(pathname) {
	const localizedPathname = `/${lang}${pathname}`;

	test('url is localized', () => {
		expect(getLangFromUrl(localizedPathname, langs)).toBe(lang);
	});

	describe('url is not localized', () => {
		test('no fallback', () => {
			expect(getLangFromUrl(pathname, langs)).toBe(null);
		});
		test('with no fallback', () => {
			expect(getLangFromUrl(pathname, langs, lang)).toBe(lang);
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
