import { test, expect, describe } from 'vitest';

import { createMessageSimple, createMessageWithParams } from '../factory';

import { isMessage } from '.';

test('pass for simple message', () => {
	const message = createMessageSimple('global.hello', () => 'Hello, world!');
	expect(isMessage(message)).toBe(true);
});

test('pass for message with params', () => {
	const message = createMessageWithParams(
		'global.greet',
		(params: { name: string }) => `Hello, ${params.name}!`,
	);
	expect(isMessage(message)).toBe(true);
});

test('fail for non-message', () => {
	expect(isMessage({})).toBe(false);
	expect(isMessage(() => 'Hello')).toBe(false);
});

describe('fail for malformed message', () => {
	test('not a function', () => {
		const malformedMessage1 = {
			$t: 'simple',
		};
		expect(isMessage(malformedMessage1)).toBe(false);
	});

	test('$t is unexpected', () => {
		const malformedMessage2 = () => 'Hello';
		malformedMessage2.$t = 'unknown-type';
		expect(isMessage(malformedMessage2)).toBe(false);
	});
});
