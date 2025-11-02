import { parse } from 'valibot';
import { test, expect } from 'vitest';

import { createMessageQueryInputSchema } from '.';

test('invalid input should throw', () => {
	const schema = createMessageQueryInputSchema(['vi', 'en']);
	expect(() => parse(schema, {})).toThrow();
	expect(() => parse(schema, {})).toThrow();
	expect(() => parse(schema, { key: 'foo' })).toThrow();
	expect(() => parse(schema, { lang: 'fr' })).toThrow();
	expect(() => parse(schema, { key: 'foo', lang: 'fr' })).toThrow();
	expect(() => parse(schema, { key: 'foo', lang: 'vi', params: 'not-an-object' })).toThrow();
});

test('valid input should pass', () => {
	const schema = createMessageQueryInputSchema(['vi', 'en']);
	let input: unknown = { key: 'welcome', lang: 'en' };
	expect(parse(schema, input)).toEqual(input);
	input = { key: 'goodbye', lang: 'vi', params: { name: 'John' } };
	expect(parse(schema, input)).toEqual(input);
});
