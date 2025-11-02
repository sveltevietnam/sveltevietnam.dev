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
			props: { tProp: {} as any, lang: 'en' },
		}),
	).rejects.toThrowError(
		'(sveltevietnam/i18n) ✘ T component in "static" mode requires "message" prop',
	);
});

describe('can still with message', () => {
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
