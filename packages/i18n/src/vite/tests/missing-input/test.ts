import { build } from 'vite';
import { test, expect, vi } from 'vitest';

import { defineTestConfig } from '../utils';

import config from './vite.config';

test('missing input should print warning', async () => {
	const consoleWarnSpy = vi.spyOn(console, 'warn');
	await build(
		defineTestConfig({
			...config,
			root: import.meta.dirname,
		}),
	);
	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringContaining('no locale entries found at ./i18n/locales'),
	);
	consoleWarnSpy.mockRestore();
});
