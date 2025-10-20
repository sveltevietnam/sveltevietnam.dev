import { test, expect, describe } from 'vitest';

import { parseMessage, type Message } from '../../../parser';

import { compile } from '.';

function createMessage(key: string, content: string): Message {
	const params = parseMessage(content);
	const type = params.length > 0 ? 'with-params' : 'simple';
	return { type, key, content, params };
}

test('empty messages', () => {
	const messages: Message[] = [];
	const compiled = compile(messages);
	expect(compiled).toBe('');
});

describe('can compile simple message', () => {
	test('one', async () => {
		const messages = [createMessage('global.hello', 'Hello, world!')];
		const compiled = compile(messages);
		await expect(compiled).toMatchFileSnapshot('./__snapshots__/simple-message/one.snap.js');
	});

	test('multiple', async () => {
		const messages = [
			createMessage('hello', 'Hello, world!'),
			createMessage('goodbye', 'Goodbye, world!'),
		];
		const compiled = compile(messages);
		await expect(compiled).toMatchFileSnapshot('./__snapshots__/simple-message/multiple.snap.js');
	});
});

describe('can compile message with parameters', () => {
	test('one message', async () => {
		const messages = [
			createMessage('greet', 'Hello, {{name}}! You have {{unreadCount}} unread messages.'),
		];
		const compiled = compile(messages);
		await expect(compiled).toMatchFileSnapshot('./__snapshots__/message-with-params/one.snap.js');
	});

	test('multiple', async () => {
		const messages = [
			createMessage(
				'notification.description',
				'{{firstName}} {{lastName}} has {{unreadCount}} unread messages.',
			),
			createMessage(
				'appointment.reminder',
				'Dear {{title}} {{lastName}}, your appointment is on {{date}}',
			),
			createMessage(
				'welcome.message',
				'Welcome, {{firstName}}{{lastName}}! We are glad to have you here.',
			),
			createMessage('varonly', '{{var}}'),
		];
		const compiled = compile(messages);
		await expect(compiled).toMatchFileSnapshot(
			'./__snapshots__/message-with-params/multiple.snap.js',
		);
	});
});
