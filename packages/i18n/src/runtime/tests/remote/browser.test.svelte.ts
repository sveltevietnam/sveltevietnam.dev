import { expect, vi, test, describe, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';

import type { Message } from '../..';
import { T } from '../../T';
import { Context, type ContextInit } from '../../context';
import { createMinimalMessageSet, mockRemoteT } from '../utils';

const messages = createMinimalMessageSet();
const remoteQuery = mockRemoteT();
const remotePrerender = mockRemoteT();
const defaultRemote = remotePrerender;

// ============================
// Mocks for generated modules
// ============================
vi.mock('@sveltevietnam/i18n/generated/constants', () => ({
	mode: 'remote',
}));
vi.mock('@sveltevietnam/i18n/generated/t.remote', () => ({
	query: remoteQuery,
	prerender: remotePrerender,
}));

// ===========================================
// helper to render message and check results
// ===========================================
async function r(
	contextInit: ContextInit<'remote', 'en' | 'vi'> & {
		remote?: 'query' | 'prerender' | typeof defaultRemote;
	},
	props: {
		message?: Message;
		key?: string;
		params?: Record<string, string>;
		lang?: 'en' | 'vi';
		remote?: 'query' | 'prerender' | typeof defaultRemote;
	},
	expects: { en: string; vi: string },
) {
	let remote = defaultRemote;
	const customRemote = props.remote ?? contextInit.remote;
	if (customRemote) {
		if (customRemote === 'query') {
			remote = remoteQuery;
		} else if (customRemote === 'prerender') {
			remote = remotePrerender;
		} else {
			remote = customRemote;
		}
	}

	let lang = $state<'en' | 'vi'>(contextInit.lang);
	const context = new Context(() => ({ ...contextInit, lang }));
	// initial render
	const screen = render(T, {
		props,
		context: new Map([[Context.KEY, context]]),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any);

	function getExpected() {
		return typeof customRemote === 'function'
			? customRemote()
			: props.lang
				? expects[props.lang]
				: expects[lang];
	}

	await expect.element(screen.getByText(getExpected())).toBeVisible();

	// change language
	lang = lang === 'en' ? 'vi' : 'en';
	await expect.element(screen.getByText(getExpected())).toBeVisible();
	lang = lang === 'en' ? 'vi' : 'en';
	await expect.element(screen.getByText(getExpected())).toBeVisible();

	if ('key' in props) {
		expect(remote).toHaveBeenCalledTimes(
			(props.lang ? 1 : 3) + (typeof customRemote === 'function' ? 3 : 0),
		);
	}
	remote.mockClear();
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
		lang: undefined,
		sanitize: undefined,
		params: undefined,
	});
	tSpy.mockRestore();
});

describe('can still render with message', () => {
	test('simple message', async () => {
		await r(
			{ lang: 'en' },
			{ message: messages.simple },
			{ en: messages.simple('en'), vi: messages.simple('vi') },
		);
	});

	test('message with params', async () => {
		await r(
			{ lang: 'en' },
			{ message: messages.withParams, params: { name: 'foobar' } },
			{
				en: messages.withParams('en', { name: 'foobar' }),
				vi: messages.withParams('vi', { name: 'foobar' }),
			},
		);
	});
});

describe('can render with key simple', () => {
	test('with lang from context', async () => {
		await r(
			{ lang: 'en' },
			{ key: messages.simple.$k },
			{ en: messages.simple('en'), vi: messages.simple('vi') },
		);
	});

	test('with lang from prop', async () => {
		await r(
			{ lang: 'en' },
			{ key: messages.simple.$k, lang: 'vi' },
			{ en: messages.simple('en'), vi: messages.simple('vi') },
		);
	});
});

describe('can render with key with params', () => {
	test('with lang from context', async () => {
		await r(
			{ lang: 'en' },
			{ key: messages.withParams.$k, params: { name: 'foobar' } },
			{
				en: messages.withParams('en', { name: 'foobar' }),
				vi: messages.withParams('vi', { name: 'foobar' }),
			},
		);
	});

	test('with lang from prop', async () => {
		await r(
			{ lang: 'en' },
			{ key: messages.withParams.$k, params: { name: 'foobar' }, lang: 'vi' },
			{
				en: messages.withParams('en', { name: 'foobar' }),
				vi: messages.withParams('vi', { name: 'foobar' }),
			},
		);
	});
});

describe('custom remote as function', () => {
	const rendered = 'from custom remote';
	const remote = vi.fn().mockImplementation(() => rendered);

	afterEach(() => {
		remote.mockClear();
	});

	test('via context', async () => {
		await r(
			{ lang: 'en', remote },
			{ key: messages.withParams.$k, params: { name: 'foobar' }, lang: 'vi' },
			{
				en: messages.withParams('en', { name: 'foobar' }),
				vi: messages.withParams('vi', { name: 'foobar' }),
			},
		);
	});

	test('via prop', async () => {
		await r(
			{ lang: 'en' },
			{ key: messages.withParams.$k, params: { name: 'foobar' }, lang: 'vi', remote },
			{
				en: messages.withParams('en', { name: 'foobar' }),
				vi: messages.withParams('vi', { name: 'foobar' }),
			},
		);
	});
});

describe(`custom remote as "query"`, () => {
	test('via context', async () => {
		await r(
			{ lang: 'en', remote: 'query' },
			{ key: messages.withParams.$k, params: { name: 'foobar' }, lang: 'vi' },
			{
				en: messages.withParams('en', { name: 'foobar' }),
				vi: messages.withParams('vi', { name: 'foobar' }),
			},
		);
	});

	test('via prop', async () => {
		await r(
			{ lang: 'en' },
			{ key: messages.withParams.$k, params: { name: 'foobar' }, lang: 'vi', remote: 'query' },
			{
				en: messages.withParams('en', { name: 'foobar' }),
				vi: messages.withParams('vi', { name: 'foobar' }),
			},
		);
	});
});

describe(`custom remote as "prerender"`, () => {
	test('via context', async () => {
		await r(
			{ lang: 'en', remote: 'prerender' },
			{ key: messages.withParams.$k, params: { name: 'foobar' }, lang: 'vi' },
			{
				en: messages.withParams('en', { name: 'foobar' }),
				vi: messages.withParams('vi', { name: 'foobar' }),
			},
		);
	});

	test('via prop', async () => {
		await r(
			{ lang: 'en' },
			{
				key: messages.withParams.$k,
				params: { name: 'foobar' },
				lang: 'vi',
				remote: 'prerender',
			},
			{
				en: messages.withParams('en', { name: 'foobar' }),
				vi: messages.withParams('vi', { name: 'foobar' }),
			},
		);
	});
});

test('custom remote prop should take precedence over context', async () => {
	await r(
		{ lang: 'en', remote: 'prerender' },
		{
			key: messages.withParams.$k,
			params: { name: 'foobar' },
			lang: 'vi',
			remote: 'query',
		},
		{
			en: messages.withParams('en', { name: 'foobar' }),
			vi: messages.withParams('vi', { name: 'foobar' }),
		},
	);
});

describe('can santize', () => {
	test.todo('by default', async () => {});
	test.todo('via santize prop', async () => {});
});
