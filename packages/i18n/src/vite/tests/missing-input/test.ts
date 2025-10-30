import { build } from 'vite';
import { test, expect, vi } from 'vitest';

import config from './vite.config';

test('missing input should print warning', async () => {
	const spiedConsoleWarn = vi.spyOn(console, 'warn');
	await build({
		...config,
		root: import.meta.dirname,
	});
	expect(spiedConsoleWarn).toHaveBeenCalledWith(
		' sveltevietnam/i18n  ⚠ no locale entries found at ./i18n/locales',
	);
	spiedConsoleWarn.mockRestore();
});
