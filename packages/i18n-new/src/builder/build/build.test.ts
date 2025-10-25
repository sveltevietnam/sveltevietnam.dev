import dedent from 'dedent';
import { vol } from 'memfs';
import { test, expect, describe, beforeEach, vi, assert } from 'vitest';

import { ErrorFileNotFound, ErrorMissingCloseBracket } from '../../parser';

import {
	build,
	ErrorInconsistentMessageKeys,
	ErrorInconsistentMessageParams,
	type BuildInput,
} from '.';

vi.mock('node:fs');
vi.mock('node:fs/promises');

const yaml = dedent;
const json = dedent;

beforeEach(() => {
	// reset the state of in-memory fs
	vol.reset();
});

describe('can build', () => {
	beforeEach(() => {
		vol.fromJSON(
			{
				'./locales/vi.yaml': yaml`
        messages:
          greeting: Xin chào, {{name}}!
          goodbye: Tạm biệt!
          component:
            '@import': '@app/components/test/vi.yaml'
			  `,
				'./locales/en.yaml': yaml`
        messages:
          greeting: Hello, {{name}}!
          goodbye: Goodbye!
          component:
            '@import': '@app/components/test/en.yaml'
			  `,
				'./node_modules/@app/components/test/vi.yaml': yaml`
        messages:
          welcome: Chào mừng {{name}}!
			  `,
				'./node_modules/@app/components/test/en.yaml': yaml`
        messages:
          welcome: Welcome {{name}}!
			  `,
				'./node_modules/@app/components/package.json': json`
				{
					"name": "@app/components",
					"exports": {
						"./test/*.yaml": "./test/*.yaml"
					}
				}
				`,
			},
			'/app',
		);
	});

	(['static', 'remote'] as const).forEach((mode) => {
		test(`${mode} mode`, async () => {
			const {
				modules: {
					messages: { targets, index },
					constants,
				},
				sources,
				numMessages,
			} = await build({
				entries: {
					vi: '/app/locales/vi.yaml',
					en: '/app/locales/en.yaml',
				},
				mode,
			});
			await expect(targets['vi']).toMatchFileSnapshot('__snapshots__/common/messages/vi.js');
			await expect(targets['en']).toMatchFileSnapshot('__snapshots__/common/messages/en.js');
			await expect(index).toMatchFileSnapshot('__snapshots__/common/messages/index.js');
			await expect(constants).toMatchFileSnapshot(`__snapshots__/${mode}/constants.js`);
			expect(sources).toEqual([
				'/app/locales/vi.yaml',
				'/app/locales/en.yaml',
				'/app/node_modules/@app/components/test/vi.yaml',
				'/app/node_modules/@app/components/test/en.yaml',
			]);
			expect(numMessages).toBe(3);
		});
	});
});

test('should forward parse locale error', async () => {
	let error: unknown = undefined;
	try {
		await build({
			entries: {
				vi: '/path/to/missing-file.yaml',
				en: '/another/missing-file.yaml',
			},
		});
	} catch (e) {
		error = e;
	}
	assert.instanceOf(error, ErrorFileNotFound);
});

test('should throw with inconsistent keys', async () => {
	vol.fromJSON(
		{
			'vi.yaml': yaml`
      messages:
        common: common message
        onlyInVi: only in vi
		`,
			'en.yaml': yaml`
      messages:
        common: common message
        onlyInEn: only in en
		`,
		},
		'/app/locales/',
	);

	const input: BuildInput = {
		entries: {
			vi: '/app/locales/vi.yaml',
			en: '/app/locales/en.yaml',
		},
	};

	let error: unknown = undefined;
	try {
		await build(input);
	} catch (e) {
		error = e;
	}
	assert.instanceOf(error, ErrorInconsistentMessageKeys);
	expect(error.cause).toMatchInlineSnapshot(`
		[
		  {
		    "in": "/app/locales/vi.yaml",
		    "key": "onlyInVi",
		    "notIn": "/app/locales/en.yaml",
		  },
		  {
		    "in": "/app/locales/en.yaml",
		    "key": "onlyInEn",
		    "notIn": "/app/locales/vi.yaml",
		  },
		]
	`);
});

test('should forward parse message params error', async () => {
	vol.fromJSON(
		{
			'vi.yaml': yaml`
      messages:
        greeting: Xin chào, {{name!
			`,
			'en.yaml': yaml`
      messages:
        greeting: Hello, {{name!
			`,
		},
		'/app/locales/',
	);
	const input: BuildInput = {
		entries: {
			vi: '/app/locales/vi.yaml',
			en: '/app/locales/en.yaml',
		},
	};

	let error: unknown = undefined;
	try {
		await build(input);
	} catch (e) {
		error = e;
	}
	assert.instanceOf(error, ErrorMissingCloseBracket);
});

test('should throw for key with inconsistent params', async () => {
	vol.fromJSON(
		{
			'vi.yaml': yaml`
      messages:
        greeting: Xin chào, {{name}}!
			`,
			'en.yaml': yaml`
      messages:
        greeting: Hello, {{firstName}}!
			`,
		},
		'/app/locales/',
	);
	const input: BuildInput = {
		entries: {
			vi: '/app/locales/vi.yaml',
			en: '/app/locales/en.yaml',
		},
	};

	let error: unknown = undefined;
	try {
		await build(input);
	} catch (e) {
		error = e;
	}
	expect(error).toBeDefined();
	assert.instanceOf(error, ErrorInconsistentMessageParams);
	expect(error.cause).toMatchInlineSnapshot(`
		[
		  {
		    "in": [
		      {
		        "file": "/app/locales/vi.yaml",
		        "params": [
		          {
		            "name": "name",
		            "positions": [
		              {
		                "end": 18,
		                "start": 10,
		              },
		            ],
		          },
		        ],
		      },
		      {
		        "file": "/app/locales/en.yaml",
		        "params": [
		          {
		            "name": "firstName",
		            "positions": [
		              {
		                "end": 20,
		                "start": 7,
		              },
		            ],
		          },
		        ],
		      },
		    ],
		    "key": "greeting",
		  },
		]
	`);
});
