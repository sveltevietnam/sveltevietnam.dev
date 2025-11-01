import { build, createServer } from 'vite';
import { test, expect, vi, afterAll, afterEach } from 'vitest';

import type { ErrorMissingCloseBracket } from '../../../parser';
import { defineTestConfig } from '../utils';

import config from './vite.config';

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

afterEach(() => {
	expect(consoleErrorSpy).toHaveBeenCalledWith(
		' sveltevietnam/i18n  ✘ failed to build, please fix reported errors and run your vite command again',
	);
	expect(consoleErrorSpy).toHaveBeenCalledWith(
		' sveltevietnam/i18n  ✘ ErrorMissingCloseBracket: Missing closing bracket "}}" for parameter "unclo..." starting at position 4',
	);
	consoleErrorSpy.mockClear();
});

afterAll(() => {
	consoleErrorSpy.mockRestore();
});

test('error from build should be forwarded to stderr', async () => {
	let e: unknown;
	try {
		await build(
			defineTestConfig({
				...config,
				root: import.meta.dirname,
			}),
		);
	} catch (error) {
		e = error;
	}
	expect(e).toBeDefined();
	expect((e as typeof ErrorMissingCloseBracket).name).toBe('ErrorMissingCloseBracket');
});

test('error from dev server should be forwarded to stderr', async () => {
	let e: unknown;
	try {
		await createServer(
			defineTestConfig({
				...config,
				root: import.meta.dirname,
			}),
		);
	} catch (error) {
		e = error;
	}
	expect(e).toBeDefined();
	expect((e as typeof ErrorMissingCloseBracket).name).toBe('ErrorMissingCloseBracket');
});
