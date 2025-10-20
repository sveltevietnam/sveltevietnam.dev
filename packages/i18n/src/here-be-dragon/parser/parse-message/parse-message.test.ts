import dedent from 'dedent';
import { test, expect, describe } from 'vitest';

import { ErrorInvalidParamName, ErrorMissingCloseBracker, parseMessage } from './parse-message';
import type { MessageParameter } from './types.public';

const html = String.raw;

test('can parse message with no param', () => {
	const msg = 'Hello World';
	const params = parseMessage(msg);
	expect(params).toEqual([]);
});

describe('can parse message with one param', () => {
	test('with param at start', () => {
		const msg = '{{name}} is here';
		const params = parseMessage(msg);
		expect(params).toEqual([
			{
				name: 'name',
				positions: [{ start: 0, end: 8 }],
			},
		] satisfies MessageParameter[]);
	});

	test('with param at middle', () => {
		const msg = 'Hello, {{name}}! Welcome.';
		const params = parseMessage(msg);
		expect(params).toEqual([
			{
				name: 'name',
				positions: [{ start: 7, end: 15 }],
			},
		] satisfies MessageParameter[]);
	});

	test('with param at end', () => {
		const msg = 'Goodbye, {{name}}';
		const params = parseMessage(msg);
		expect(params).toEqual([
			{
				name: 'name',
				positions: [{ start: 9, end: 17 }],
			},
		] satisfies MessageParameter[]);
	});
});

describe('can parse message with multiple params', () => {
	describe('no space between params', () => {
		describe('at start', () => {
			test('different names', () => {
				const msg = '{{first}}{{second}} lorem ipsum...';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'first',
						positions: [{ start: 0, end: 9 }],
					},
					{
						name: 'second',
						positions: [{ start: 9, end: 19 }],
					},
				] satisfies MessageParameter[]);
			});

			test('same name', () => {
				const msg = '{{name}}{{name}} lorem ipsum...';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'name',
						positions: [
							{ start: 0, end: 8 },
							{ start: 8, end: 16 },
						],
					},
				] satisfies MessageParameter[]);
			});
		});

		describe('at end', () => {
			test('different names', () => {
				const msg = 'lorem ipsum... {{first}}{{second}}';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'first',
						positions: [{ start: 15, end: 24 }],
					},
					{
						name: 'second',
						positions: [{ start: 24, end: 34 }],
					},
				] satisfies MessageParameter[]);
			});

			test('same name', () => {
				const msg = 'lorem ipsum... {{name}}{{name}}';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'name',
						positions: [
							{ start: 15, end: 23 },
							{ start: 23, end: 31 },
						],
					},
				] satisfies MessageParameter[]);
			});
		});

		describe('in middle', () => {
			test('different names', () => {
				const msg = 'lorem {{first}}{{second}} ipsum...';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'first',
						positions: [{ start: 6, end: 15 }],
					},
					{
						name: 'second',
						positions: [{ start: 15, end: 25 }],
					},
				] satisfies MessageParameter[]);
			});

			test('same name', () => {
				const msg = 'lorem {{name}}{{name}} ipsum...';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'name',
						positions: [
							{ start: 6, end: 14 },
							{ start: 14, end: 22 },
						],
					},
				] satisfies MessageParameter[]);
			});
		});
	});

	describe('with space between params', () => {
		describe('at start', () => {
			test('different names', () => {
				const msg = '{{first}} and {{second}} lorem ipsum...';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'first',
						positions: [{ start: 0, end: 9 }],
					},
					{
						name: 'second',
						positions: [{ start: 14, end: 24 }],
					},
				] satisfies MessageParameter[]);
			});

			test('same name', () => {
				const msg = '{{name}} and {{name}} lorem ipsum...';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'name',
						positions: [
							{ start: 0, end: 8 },
							{ start: 13, end: 21 },
						],
					},
				] satisfies MessageParameter[]);
			});
		});

		describe('at end', () => {
			test('different names', () => {
				const msg = 'lorem ipsum... {{first}} and {{second}}';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'first',
						positions: [{ start: 15, end: 24 }],
					},
					{
						name: 'second',
						positions: [{ start: 29, end: 39 }],
					},
				] satisfies MessageParameter[]);
			});

			test('same name', () => {
				const msg = 'lorem ipsum... {{name}} and {{name}}';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'name',
						positions: [
							{ start: 15, end: 23 },
							{ start: 28, end: 36 },
						],
					},
				] satisfies MessageParameter[]);
			});
		});

		describe('in middle', () => {
			test('different names', () => {
				const msg = 'lorem {{first}} and {{second}} ipsum...';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'first',
						positions: [{ start: 6, end: 15 }],
					},
					{
						name: 'second',
						positions: [{ start: 20, end: 30 }],
					},
				] satisfies MessageParameter[]);
			});

			test('same name', () => {
				const msg = 'lorem {{name}} and {{name}} ipsum...';
				const params = parseMessage(msg);
				expect(params).toEqual([
					{
						name: 'name',
						positions: [
							{ start: 6, end: 14 },
							{ start: 19, end: 27 },
						],
					},
				] satisfies MessageParameter[]);
			});
		});
	});
});

test('can parse HTML message', () => {
	const msg = html`<p>Hello, {{name}}! Welcome to <strong>{{site_name}}</strong>.</p>`;
	const params = parseMessage(msg);
	expect(params).toEqual([
		{
			name: 'name',
			positions: [{ start: 10, end: 18 }],
		},
		{
			name: 'site_name',
			positions: [{ start: 39, end: 52 }],
		},
	] satisfies MessageParameter[]);
});

test('should throw if missing closing bracket', () => {
	const msg = 'Hello, {{name! Welcome.';
	const result = expect(() => parseMessage(msg));
	result.toThrow(ErrorMissingCloseBracker);
	result.toThrowErrorMatchingInlineSnapshot(dedent`
		[ErrorMissingCloseBracker: Missing closing bracket "}}" for parameter "name!..." starting at position 7]
	`);
});

test('should throw if parameter contains characters other an alphanumeric or _', () => {
	const msg = 'Hello, {{na!me}}!';
	const result = expect(() => parseMessage(msg));
	result.toThrow(ErrorInvalidParamName);
	result.toThrowErrorMatchingInlineSnapshot(dedent`
		[ErrorInvalidParamName: Invalid parameter "na!me" at position 7. Parameter names must only contain alphanumeric characters and underscores.]
	`);
});
