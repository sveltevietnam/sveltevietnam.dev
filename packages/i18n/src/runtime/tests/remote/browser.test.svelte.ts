import { expect, vi, test, describe, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';

import type { Message } from '../..';
import { T } from '../../T';
import { Context } from '../../context';
import { createMinimalMessageSet, mockRemoteT } from '../utils';

const messages = createMinimalMessageSet();
const remoteT = mockRemoteT();

// ============================
// Mocks for generated modules
// ============================
vi.mock('@sveltevietnam/i18n/generated/constants', () => ({
	mode: 'remote',
}));
vi.mock('@sveltevietnam/i18n/generated/t.remote', () => ({
	query: remoteT,
	prerender: remoteT,
}));

afterEach(() => {
	remoteT.mockClear();
});

// ===========================================
// helper to render message and check results
// ===========================================
async function r(
	props: { message?: Message; key?: string; params?: Record<string, string> },
	expects: { en: string; vi: string },
) {
	let lang = $state('en');
	const context = new Context(() => ({ lang }));
	// initial render
	const screen = render(T, {
		props,
		context: new Map([[Context.KEY, context]]),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any);
	await expect.element(screen.getByText(expects.en)).toBeVisible();

	// change language
	lang = 'vi';
	await expect.element(screen.getByText(expects.vi)).toBeVisible();
	lang = 'en';
	await expect.element(screen.getByText(expects.en)).toBeVisible();

	if ('key' in props) {
		expect(remoteT).toHaveBeenCalledTimes(3);
	}
}

// ======
// Tests
// ======
test('throw if not in context', async () => {
	expect(() => render(T)).toThrowError(
		"T component must live within a `import('@sveltevietnam/i18n').Context`",
	);
});

test('throw if message and key is missing', async () => {
	const context = new Context<'remote'>(() => ({ lang: 'en' }));
	const tSpy = vi.spyOn(context, 't').mockImplementationOnce((args) => {
		try {
			return context.t(args);
		} catch (e) {
			expect((e as Error).message).toBe(
				'(sveltevietnam/i18n) ✘ T component in "remote" mode requires "key" prop',
			);
			return Promise.resolve('error');
		}
	});
	render(T, {
		context: new Map([[Context.KEY, context]]),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any);
	expect(tSpy).toHaveBeenCalledWith({
		message: undefined,
		key: undefined,
		options: {
			lang: undefined,
			sanitize: undefined,
		},
		params: undefined,
	});
	tSpy.mockRestore();
});

describe('can still render with message', () => {
	test('simple message', async () => {
		await r({ message: messages.simple }, { en: messages.simple('en'), vi: messages.simple('vi') });
	});

	test('message with params', async () => {
		await r(
			{ message: messages.withParams, params: { name: 'foobar' } },
			{
				en: messages.withParams('en', { name: 'foobar' }),
				vi: messages.withParams('vi', { name: 'foobar' }),
			},
		);
	});
});

describe('can render with key', () => {
	test('simple message', async () => {
		await r({ key: messages.simple.$k }, { en: messages.simple('en'), vi: messages.simple('vi') });
	});
	test('message with params', async () => {
		await r(
			{ key: messages.withParams.$k, params: { name: 'foobar' } },
			{
				en: messages.withParams('en', { name: 'foobar' }),
				vi: messages.withParams('vi', { name: 'foobar' }),
			},
		);
	});
});
