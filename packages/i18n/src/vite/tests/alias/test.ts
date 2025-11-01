import { build, type Rollup } from 'vite';
import { test, expect } from 'vitest';

import { defineTestConfig } from '../utils';

import config from './vite.config';

test('alias defined by another plugin is correctly resolved', async () => {
	const { output } = (await build(
		defineTestConfig({
			...config,
			root: import.meta.dirname,
		}),
	)) as Rollup.RollupOutput;
	const module = (
		output.find((f) => f.name === 'index' && f.fileName.endsWith('.js')) as Rollup.OutputChunk
	).code;
	expect(module).toMatch('bar');
});
