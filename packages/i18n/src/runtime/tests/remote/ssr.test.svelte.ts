import { render } from 'svelte/server';
import { expect, vi, test, describe, afterEach, afterAll } from 'vitest';

import { T } from '../../T';
import InProvider from '../in-provider.svelte';
import { createMinimalMessageSet, mockRemoteT } from '../utils';

const messages = createMinimalMessageSet();
const remoteQuery = mockRemoteT();
const remotePrerender = mockRemoteT();
const defaultRemote = remoteQuery; // FIXME: change to prerender when all working

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
			props: { t: {} as any, context: { lang: 'en' } },
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			props: { t: { message: messages.simple } as any, context: { lang: 'en' } },
		});
		expect(body).toContain(messages.simple('en'));
	});

	test('message with params', async () => {
		const { body } = await render(InProvider, {
			props: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				t: { message: messages.withParams, params: { name: 'foobar' } } as any,
				context: { lang: 'en' },
			},
		});
		expect(body).toContain(messages.withParams('en', { name: 'foobar' }));
	});
});

describe('can render key simple', () => {
	test('with lang from context', async () => {
		const { body } = await render(InProvider, {
			props: { t: { key: messages.simple.$k }, context: { lang: 'en' } },
		});
		expect(body).toContain(messages.simple('en'));
		expect(defaultRemote).toHaveBeenCalledOnce();
		defaultRemote.mockClear();
	});

	test('with lang from prop', async () => {
		const { body } = await render(InProvider, {
			props: { t: { key: messages.simple.$k, lang: 'vi' }, context: { lang: 'en' } },
		});
		expect(body).toContain(messages.simple('vi'));
		expect(defaultRemote).toHaveBeenCalledOnce();
		defaultRemote.mockClear();
	});
});

describe('can render key with params', () => {
	test('with lang from context', async () => {
		const { body } = await render(InProvider, {
			props: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				t: { key: messages.withParams.$k, params: { name: 'foobar' } } as any,
				context: { lang: 'en' },
			},
		});
		expect(body).toContain(messages.withParams('en', { name: 'foobar' }));
		expect(defaultRemote).toHaveBeenCalledOnce();
		defaultRemote.mockClear();
	});

	test('with lang from prop', async () => {
		const { body } = await render(InProvider, {
			props: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				t: { key: messages.withParams.$k, lang: 'vi', params: { name: 'foobar' } } as any,
				context: { lang: 'en' },
			},
		});
		expect(body).toContain(messages.withParams('vi', { name: 'foobar' }));
		expect(defaultRemote).toHaveBeenCalledOnce();
		defaultRemote.mockClear();
	});
});

describe('can custom remote function', () => {
	describe('as custom function', () => {
		const rendered = 'from custom remote';
		const remote = vi.fn().mockImplementation(() => rendered);

		afterEach(() => {
			expect(remote).toHaveBeenCalledOnce();
			remote.mockClear();
		});

		test('via context', async () => {
			const { body } = await render(InProvider, {
				props: {
					t: {
						key: messages.withParams.$k,
						params: { name: 'foobar' },
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
					} as any,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					context: { lang: 'en', remote } as any,
				},
			});
			expect(body).toContain(rendered);
		});

		test('via prop', async () => {
			const { body } = await render(InProvider, {
				props: {
					t: {
						key: messages.withParams.$k,
						params: { name: 'foobar' },
						remote,
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
					} as any,
					context: { lang: 'en' },
				},
			});
			expect(body).toContain(rendered);
		});
	});

	test('prop should take precedence over context', async () => {
		const rendered = 'from custom remote';
		const remote = vi.fn().mockImplementation(() => rendered);
		const { body } = await render(InProvider, {
			props: {
				t: {
					key: messages.withParams.$k,
					params: { name: 'foobar' },
					remote,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} as any,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				context: { lang: 'en', remote: 'prerender' } as any,
			},
		});
		expect(body).toContain(rendered);
	});

	for (const remote of ['query', 'prerender'] as const) {
		describe(`as "${remote}"`, () => {
			test('via context', async () => {
				const { body } = await render(InProvider, {
					props: {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						t: { key: messages.withParams.$k, params: { name: 'foobar' } } as any,
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						context: { lang: 'en', remote } as any,
					},
				});
				expect(body).toContain(messages.withParams('en', { name: 'foobar' }));
				const remoteMock = remote === 'query' ? remoteQuery : remotePrerender;
				expect(remoteMock).toHaveBeenCalledOnce();
				remoteMock.mockClear();
			});

			test('via prop', async () => {
				const { body } = await render(InProvider, {
					props: {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						t: { key: messages.withParams.$k, params: { name: 'foobar' }, remote } as any,
						context: { lang: 'en' },
					},
				});
				expect(body).toContain(messages.withParams('en', { name: 'foobar' }));
				const remoteMock = remote === 'query' ? remoteQuery : remotePrerender;
				expect(remoteMock).toHaveBeenCalledOnce();
				remoteMock.mockClear();
			});
		});
	}
});

describe('can santize', () => {
	test.todo('by default', async () => {});
	test.todo('via santize prop', async () => {});
});
