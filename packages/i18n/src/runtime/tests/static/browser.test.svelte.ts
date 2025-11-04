import { expect, vi, test, describe } from 'vitest';
import { render } from 'vitest-browser-svelte';

import { T } from '../../T';
import { Context } from '../../context';
import { createMinimalMessageSet } from '../utils';

const messages = createMinimalMessageSet();
// ============================
// Mocks for generated modules
// ============================
vi.mock('@sveltevietnam/i18n/generated/constants', () => ({
	mode: 'static',
}));
vi.mock('@sveltevietnam/i18n/generated/t.remote', () => ({
	prerender: vi.fn(),
	query: vi.fn(),
}));

// ======
// Tests
// ======
test('throw if not in context', async () => {
	expect(() => render(T)).toThrowError(
		"T component must live within a `import('@sveltevietnam/i18n').Context`",
	);
});

test('throw if message is missing', async () => {
	const context = new Context<'static'>(() => ({ lang: 'en' }));
	const tSpy = vi.spyOn(context, 't').mockImplementationOnce((args) => {
		try {
			return context.t(args);
		} catch (e) {
			expect((e as Error).message).toBe(
				'(sveltevietnam/i18n) ✘ T component in "static" mode requires "message" prop',
			);
			return 'error';
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
	tSpy.mockReset();
});

describe('can render simple message', () => {
	test('with lang from context', async () => {
		let lang = $state('en');
		const context = new Context(() => ({ lang }));

		// initial render
		const screen = render(T, {
			props: { message: messages.simple },
			context: new Map([[Context.KEY, context]]),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
		const en = messages.simple('en');
		const vi = messages.simple('vi');
		await expect.element(screen.getByText(en)).toBeVisible();

		// change language
		lang = 'vi';
		await expect.element(screen.getByText(vi)).toBeVisible();
		lang = 'en';
		await expect.element(screen.getByText(en)).toBeVisible();
	});

	test('with lang from prop', async () => {
		let lang = $state('en');
		const context = new Context(() => ({ lang }));

		// initial render
		const screen = render(T, {
			props: { message: messages.simple, lang: 'vi' },
			context: new Map([[Context.KEY, context]]),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
		const vi = messages.simple('vi');
		await expect.element(screen.getByText(vi)).toBeVisible();

		// change language
		lang = 'vi';
		await expect.element(screen.getByText(vi)).toBeVisible();
		lang = 'en';
		await expect.element(screen.getByText(vi)).toBeVisible();
	});
});

describe('can render message with params', () => {
	test('with lang from context', async () => {
		let lang = $state('en');
		const context = new Context(() => ({ lang }));

		// initial render
		const screen = render(T, {
			props: { message: messages.withParams, params: { name: 'foobar' } },
			context: new Map([[Context.KEY, context]]),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
		const en = messages.withParams('en', { name: 'foobar' });
		const vi = messages.withParams('vi', { name: 'foobar' });
		await expect.element(screen.getByText(en)).toBeVisible();

		// change language
		lang = 'vi';
		await expect.element(screen.getByText(vi)).toBeVisible();
		lang = 'en';
		await expect.element(screen.getByText(en)).toBeVisible();
	});

	test('with lang from prop', async () => {
		let lang = $state('en');
		const context = new Context(() => ({ lang }));

		// initial render
		const screen = render(T, {
			props: { message: messages.withParams, lang: 'vi', params: { name: 'foobar' } },
			context: new Map([[Context.KEY, context]]),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
		const vi = messages.withParams('vi', { name: 'foobar' });
		await expect.element(screen.getByText(vi)).toBeVisible();

		// change language
		lang = 'vi';
		await expect.element(screen.getByText(vi)).toBeVisible();
		lang = 'en';
		await expect.element(screen.getByText(vi)).toBeVisible();
	});
});

describe('can santize', () => {
	test.todo('by default', async () => {});
	test.todo('via santize prop', async () => {});
});
