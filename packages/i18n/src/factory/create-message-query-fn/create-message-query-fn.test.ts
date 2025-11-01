import { parse } from 'valibot';
import { test, describe, expect, vi, afterEach } from 'vitest';

import { createMessageQueryFn, createMessageQueryInputSchema } from '.';

describe('createMessageQueryInputSchema', () => {
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
});

describe('createMessageQueryFn', () => {
	const enWelcome = vi.fn(() => 'Welcome!');
	const enGreeting = vi.fn(({ name }: { name: string }) => `Hello, ${name}!`);
	const enMod = vi.fn(async () => ({
		welcome: enWelcome,
		'component.greeting': enGreeting,
	}));

	const viWelcome = vi.fn(() => 'Chào mừng!');
	const viGreeting = vi.fn(({ name }: { name: string }) => `Xin chào, ${name}!`);
	const viMod = vi.fn(async () => ({
		welcome: viWelcome,
		'component.greeting': viGreeting,
	}));

	const modules = { './messages/en.js': enMod, './messages/vi.js': viMod };

	afterEach(() => {
		// reset mocks
		[enMod, enWelcome, enGreeting, viMod, viWelcome, viGreeting].forEach((fn) => fn.mockClear());
	});

	test('should return correctly with single input', async () => {
		const queryFn = createMessageQueryFn(modules);
		// first message
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let input: any = { key: 'welcome', lang: 'en' };
		let resolveSingularInput = await queryFn([input]);
		expect(enMod).toHaveBeenCalledTimes(1);
		expect(viMod).toHaveBeenCalledTimes(0);

		expect(resolveSingularInput).toBeInstanceOf(Function);
		expect(resolveSingularInput(input)).toBe('Welcome!');
		expect(enWelcome).toHaveBeenCalledTimes(1);

		enMod.mockClear();
		enWelcome.mockClear();
		viMod.mockClear();

		// second message
		input = { key: 'component.greeting', lang: 'vi', params: { name: 'An' } };
		resolveSingularInput = await queryFn([input]);
		expect(viMod).toHaveBeenCalledTimes(1);
		expect(enMod).toHaveBeenCalledTimes(0);

		expect(resolveSingularInput).toBeInstanceOf(Function);
		expect(resolveSingularInput(input)).toBe('Xin chào, An!');
		expect(viGreeting).toHaveBeenCalledTimes(1);
	});

	test('should return correctly with multiple inputs', async () => {
		const queryFn = createMessageQueryFn(modules);
		const inputs = [
			{ key: 'welcome', lang: 'vi' },
			{ key: 'component.greeting', lang: 'en', params: { name: 'John' } },
		];
		const resolveSingularInput = await queryFn(inputs);
		expect(viMod).toHaveBeenCalledTimes(1);
		expect(enMod).toHaveBeenCalledTimes(1);

		expect(resolveSingularInput).toBeInstanceOf(Function);
		expect(resolveSingularInput(inputs[0])).toBe('Chào mừng!');
		expect(viWelcome).toHaveBeenCalledTimes(1);
		expect(resolveSingularInput(inputs[1])).toBe('Hello, John!');
		expect(enGreeting).toHaveBeenCalledTimes(1);
	});
});
