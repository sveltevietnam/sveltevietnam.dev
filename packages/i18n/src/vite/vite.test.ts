import path from 'node:path';

import defu from 'defu';
import { build, type UserConfig, type Rollup } from 'vite';
import { test, expect, vi } from 'vitest';

import type { BuildMode } from '../builder';

import { i18n } from '.';

function createViteConfig(root: string, mode: BuildMode, overrides?: UserConfig): UserConfig {
	return defu(overrides, {
		root,
		logLevel: 'error',
		build: {
			minify: false,
			write: false,
		},
		plugins: [
			i18n({
				input: './i18n/locales',
				output: './i18n/generated',
				mode: mode,
			}),
		],
	} satisfies UserConfig);
}

test('output can be tree-shaken', async () => {
	const { output } = (await build(
		createViteConfig(path.resolve(import.meta.dirname, 'tests/treeshaking'), 'static'),
	)) as Rollup.RollupOutput;
	const module = (
		output.find((f) => f.name === 'index' && f.fileName.endsWith('.js')) as Rollup.OutputChunk
	).code;

	const SIMPLE_KEEP = 'SIMPLE_KEEP';
	const SIMPLE_REMOVE = 'SIMPLE_REMOVE';
	const PARAMS_KEEP = 'PARAMS_KEEP';
	const PARAMS_REMOVE = 'PARAMS_REMOVE';

	// these strings are included in output
	expect(module).toMatch('const langs');
	for (const lang of ['vi', 'en']) {
		expect(module).toMatch(`${lang} - ${SIMPLE_KEEP}`);
		expect(module).toMatch(`${lang} - ${PARAMS_KEEP}`);
	}

	// these constants should have been removed by tree-shaking
	expect(module).not.toMatch('const keys');
	expect(module).not.toMatch('const mode');
	for (const lang of ['vi', 'en']) {
		expect(module).not.toMatch(`${lang} - ${SIMPLE_REMOVE}`);
		expect(module).not.toMatch(`${lang} - ${PARAMS_REMOVE}`);
	}
});

test('missing input should print warning', async () => {
	const mockedConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	(await build(
		createViteConfig(path.resolve(import.meta.dirname, 'tests/missing-input'), 'static', {
			logLevel: 'warn',
		}),
	)) as Rollup.RollupOutput;
	expect(mockedConsoleWarn).toHaveBeenCalledWith(
		' sveltevietnam/i18n  ⚠ no locale entries found at ./i18n/locales',
	);
	mockedConsoleWarn.mockRestore();
});

test.todo('alias should resolve correctly', async () => {});

test.todo('build error should be forwarded', async () => {});
