import { render } from 'svelte/server';
import { expect, vi, test, describe } from 'vitest';

import { T } from '../../T';
import InProvider from '../in-provider.svelte';
import { createMinimalMessageSet, mockRemoteT } from '../utils';

const messages = createMinimalMessageSet();
const remoteT = mockRemoteT();

// ============================
// Mocks for generated modules
// ============================
vi.mock('@sveltevietnam/i18n/generated/constants', () => ({
	mode: 'static',
}));
vi.mock('@sveltevietnam/i18n/generated/t.remote', () => ({
	query: remoteT,
	prerender: remoteT,
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

test('throw if message is missing', async () => {
	await expect(
		render(InProvider, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			props: { t: {} as any, context: { lang: 'en' } },
		}),
	).rejects.toThrowError(
		'(sveltevietnam/i18n) ✘ T component in "static" mode requires "message" prop',
	);
});

describe('can render simple message', () => {
	test('with lang from context', async () => {
		const { body } = await render(InProvider, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			props: { t: { message: messages.simple } as any, context: { lang: 'en' } },
		});
		expect(body).toContain(messages.simple('en'));
	});

	test('with lang from prop', async () => {
		const { body } = await render(InProvider, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			props: { t: { message: messages.simple, lang: 'vi' } as any, context: { lang: 'en' } },
		});
		expect(body).toContain(messages.simple('vi'));
	});
});

describe('can render message with params', () => {
	test('with lang from context', async () => {
		const { body } = await render(InProvider, {
			props: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				t: { message: messages.withParams, params: { name: 'foobar' } } as any,
				context: { lang: 'en' },
			},
		});
		expect(body).toContain(messages.withParams('en', { name: 'foobar' }));
	});

	test('with lang from prop', async () => {
		const { body } = await render(InProvider, {
			props: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				t: { message: messages.withParams, lang: 'vi', params: { name: 'foobar' } } as any,
				context: { lang: 'en' },
			},
		});
		expect(body).toContain(messages.withParams('vi', { name: 'foobar' }));
	});
});

describe('can santize', () => {
	test.todo('by default', async () => {});
	test.todo('via santize prop', async () => {});
});
