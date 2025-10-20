import { test, expect } from 'vitest';

import { createMessageSimple, createMessageWithParams } from '.';

test('can create simple message', () => {
	const message = createMessageSimple('global.hello', () => 'Hello, world!');
	expect(message.$k).toBe('global.hello');
	expect(message.$t).toBe('simple');
});

test('can create message with params', () => {
	const message = createMessageWithParams(
		'global.greet',
		(params: { name: string }) => `Hello, ${params.name}!`,
	);
	expect(message.$k).toBe('global.greet');
	expect(message.$t).toBe('with-params');
});
