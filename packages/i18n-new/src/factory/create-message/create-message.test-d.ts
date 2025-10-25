import { test, expectTypeOf } from 'vitest';

import { type MessageSimple, type MessageWithParams } from '../runtime/types.public';

import { createMessageSimple, createMessageWithParams } from '.';

test('can create simple message', () => {
	const message = createMessageSimple('global.hello', {
		vi: () => 'Xin chào!',
		en: () => 'Hello, world!',
	});
	expectTypeOf(message).toMatchTypeOf<MessageSimple<'vi' | 'en', 'global.hello'>>();
});

test('can create message with params', () => {
	const message = createMessageWithParams('global.greet', {
		vi: (params: { name: string }) => `Xin chào, ${params.name}!`,
		en: (params: { name: string }) => `Hello, ${params.name}!`,
	});
	expectTypeOf(message).toMatchTypeOf<MessageWithParams<'vi' | 'en', 'global.greet', 'name'>>();
	expectTypeOf(message).parameter(0).toMatchTypeOf<string>();
	expectTypeOf(message).parameter(1).toMatchObjectType<{ name: string }>();
});
