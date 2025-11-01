import { test, expect } from 'vitest';

import { createMessageSimple, createMessageWithParams } from '.';

test('can create simple message', () => {
	const message = createMessageSimple('global.hello', {
		vi: () => 'Xin chào!',
		en: () => 'Hello, world!',
	});
	expect(message.$k).toBe('global.hello');
	expect(message.$t).toBe('simple');
	expect(message('vi')).toBe('Xin chào!');
	expect(message('en')).toBe('Hello, world!');
});

test('can create message with params', () => {
	const message = createMessageWithParams('global.greet', {
		vi: (params: { name: string }) => `Xin chào, ${params.name}!`,
		en: (params: { name: string }) => `Hello, ${params.name}!`,
	});
	expect(message.$k).toBe('global.greet');
	expect(message.$t).toBe('with-params');
	expect(message('vi', { name: 'An' })).toBe('Xin chào, An!');
	expect(message('en', { name: 'An' })).toBe('Hello, An!');
});
