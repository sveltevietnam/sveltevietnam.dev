import { test, expect } from 'vitest';

import { createMessageSimple, createMessageWithParams } from '.';

test('can create simple message', () => {
	const message = createMessageSimple('global.hello', {
		vi: () => 'Xin chào!',
		en: () => 'Hello, world!',
	});
	expect(message.$k).toBe('global.hello');
	expect(message.$t).toBe('simple');
});

test('can create message with params', () => {
	const message = createMessageWithParams('global.greet', {
		vi: (params: { name: string }) => `Xin chào, ${params.name}!`,
		en: (params: { name: string }) => `Hello, ${params.name}!`,
	});
	expect(message.$k).toBe('global.greet');
	expect(message.$t).toBe('with-params');
});
