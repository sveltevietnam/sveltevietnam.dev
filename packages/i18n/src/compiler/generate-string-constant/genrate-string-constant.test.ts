import dedent from 'dedent';
import { test, expect } from 'vitest';

import { print } from '../utils';

import { generateStringConstant } from './genrate-string-constant';

const js = dedent;

test('can generate from empty value', () => {
	const node = generateStringConstant('mode', '');
	expect(print([node], false)).toEqual(js`
		export const mode = /**@type {const}*/ ("");\n
	`);
});

test('can generate from non-empty value', () => {
	const node = generateStringConstant('mode', 'static');
	expect(print([node], false)).toEqual(js`
		export const mode = /**@type {const}*/ ("static");\n
	`);
});
