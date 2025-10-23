import dedent from 'dedent';
import { test, expect } from 'vitest';

import { print } from '../utils';

import { generateStringArrayConstant } from '.';

const js = dedent;

test('can generate from empty array', () => {
	const node = generateStringArrayConstant('strings', []);
	expect(print([node], false)).toEqual(js`
		export const strings = /**@const */ ([]);\n
	`);
});

test('can generate and sort from non-empty array', () => {
	const node = generateStringArrayConstant('langs', ['vi', 'en'], true);
	expect(print([node], false)).toEqual(js`
		export const langs = /**@const */ (["en", "vi"]);\n
	`);
});

test('can generate from non-empty array', () => {
	const node = generateStringArrayConstant('keys', ['welcome', 'goodbye', 'component.test']);
	expect(print([node], false)).toEqual(js`
		export const keys = /**@const */ (["welcome", "goodbye", "component.test"]);\n
	`);
});
