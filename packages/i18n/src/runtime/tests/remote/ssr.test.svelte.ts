import { render } from 'svelte/server';
import { expect, vi, test, describe, afterEach, afterAll } from 'vitest';

import { T } from '../../T';
import InProvider from '../in-provider.svelte';
import { createMinimalMessageSet, mockRemoteT } from '../utils';

const messages = createMinimalMessageSet();
const remoteT = mockRemoteT();

// ============================
// Mocks for generated modules
// ============================
vi.mock('$i18n/constants.js', () => ({
	mode: 'remote',
}));
vi.mock('$i18n/t.remote.js', () => ({
	t: remoteT,
}));

// ======
// Tests
// ======
test('throw if not in context', async () => {
	await expect(
		render(T, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			props: {} as any,
		}),
	).rejects.toThrowError("T component must live within a `import('@sveltevietnam/i18n').Context`");
});

test('throw if message and key is missing', async () => {
	await expect(
		render(InProvider, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			props: { tProp: {} as any, lang: 'en' },
		}),
	).rejects.toThrowError('(sveltevietnam/i18n) ✘ T component in "remote" mode requires "key" prop');
});

describe('can still render with message, but recieve warning', () => {
	const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

	afterEach(() => {
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			'\x1b[43m sveltevietnam/i18n ⚠ \x1b[0m',
			'\x1b[33m T component is in remote mode but received "message" prop; optimize by passing "key" prop instead \x1b[0m',
		);
	});

	afterAll(() => {
		consoleWarnSpy.mockRestore();
	});

	test('simple message', async () => {
		const { body } = await render(InProvider, {
			props: { tProp: { message: messages.simple }, lang: 'en' },
		});
		expect(body).toContain(messages.simple('en'));
	});

	test('message with params', async () => {
		const { body } = await render(InProvider, {
			props: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				tProp: { message: messages.withParams, params: { name: 'foobar' } } as any,
				lang: 'en',
			},
		});
		expect(body).toContain(messages.withParams('en', { name: 'foobar' }));
	});
});

describe('can render with key', () => {
	test('simple message', async () => {
		const { body } = await render(InProvider, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			props: { tProp: { key: messages.simple.$k }, lang: 'en' } as any,
		});
		expect(body).toContain(messages.simple('en'));
		expect(remoteT).toHaveBeenCalledOnce();
		remoteT.mockClear();
	});

	test('message with params', async () => {
		const { body } = await render(InProvider, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			props: { tProp: { key: messages.withParams.$k }, lang: 'en' } as any,
		});
		expect(body).toContain(messages.simple('en'));
		expect(remoteT).toHaveBeenCalledOnce();
		remoteT.mockClear();
	});
});
