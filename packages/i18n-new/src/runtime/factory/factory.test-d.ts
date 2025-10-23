import { test, expectTypeOf } from 'vitest';

import { type MessageSimple, type MessageWithParams } from '../types.public';

import { createMessageSimple, createMessageWithParams } from './factory';

test('can create simple message', () => {
	const message = createMessageSimple('global.hello', () => 'Hello, world!');
	expectTypeOf(message).toMatchTypeOf<MessageSimple<'global.hello'>>();
});

test('can create message with params', () => {
	const message = createMessageWithParams(
		'global.greet',
		(params: { name: string }) => `Hello, ${params.name}!`,
	);
	expectTypeOf(message).toMatchTypeOf<MessageWithParams<'global.greet', 'name'>>();
	expectTypeOf(message).parameter(0).toMatchObjectType<{ name: string }>();
});
