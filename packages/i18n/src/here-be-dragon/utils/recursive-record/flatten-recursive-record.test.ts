/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from 'vitest';

import {
	ErrorMissingFieldWithNoFallback,
	ErrorMissingInput,
	flattenRecursiveRecord,
} from './flatten-recursive-record.js';

test('primitive and array should be kept by default', () => {
	const input = { number: 1, string: 'test', boolean: true, array: [1, 2, 3] };
	const output = flattenRecursiveRecord(input);
	expect(output).toEqual(input);
});

test('undefined/null input should throw', () => {
	expect(() => flattenRecursiveRecord(undefined as any)).toThrow(ErrorMissingInput);
	expect(() => flattenRecursiveRecord(null as any)).toThrow(ErrorMissingInput);
});

test('undefined/null field should throw without fallback', () => {
	expect(() => flattenRecursiveRecord({ null: null })).toThrow(ErrorMissingFieldWithNoFallback);
	expect(() => flattenRecursiveRecord({ undefined: undefined })).toThrow(
		ErrorMissingFieldWithNoFallback,
	);
});

test('undefined/null field should use fallback if provided', () => {
	const input = { a: 1, b: null, c: undefined } as any;
	const output = flattenRecursiveRecord<number>(input, { fallback: 0 });
	expect(output).toEqual({ a: 1, b: 0, c: 0 });
});

test('nested records should be flattened', () => {
	const input = {
		a: 1,
		b: {
			c: 2,
			d: {
				e: 3,
				f: 4,
			},
			g: 5,
		},
		h: 6,
	};
	const output = flattenRecursiveRecord(input);
	expect(output).toEqual({
		a: 1,
		'b.c': 2,
		'b.d.e': 3,
		'b.d.f': 4,
		'b.g': 5,
		h: 6,
	});
});

test('custom predicate should work', () => {
	const input = {
		a: 1,
		b: {
			c: [2, 3],
			d: {
				e: 4,
			},
		},
	};
	const output = flattenRecursiveRecord<any>(input, {
		predicate: (v): v is any => typeof v !== 'object',
	});
	expect(output).toEqual({
		a: 1,
		'b.c.0': 2,
		'b.c.1': 3,
		'b.d.e': 4,
	});
});

test('rootKey should prefix all keys', () => {
	const input = {
		a: 1,
		b: {
			c: 2,
			d: {
				e: 3,
			},
			f: 4,
		},
		g: 4,
	};
	const output = flattenRecursiveRecord(input, { rootKey: 'root' });
	expect(output).toEqual({
		'root.a': 1,
		'root.b.c': 2,
		'root.b.d.e': 3,
		'root.b.f': 4,
		'root.g': 4,
	});
});
