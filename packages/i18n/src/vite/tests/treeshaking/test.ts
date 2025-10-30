import { build, type Rollup } from 'vite';
import { test, expect } from 'vitest';

import config from './vite.config';

test('output can be tree-shaken', async () => {
	const { output } = (await build({
		...config,
		root: import.meta.dirname,
	})) as Rollup.RollupOutput;
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
