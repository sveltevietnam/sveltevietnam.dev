import dedent from 'dedent';
import { vol } from 'memfs';
import { test, expect, beforeEach, vi, assert } from 'vitest';

import { ErrorFileNotFound } from '../../parser';

import {
	build,
	ErrorInconsistentMessageKeys,
	ErrorInconsistentMessageParams,
	ErrorMessageParse,
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

test('can build', async () => {
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

	const output = await build({
		entries: {
			vi: '/app/locales/vi.yaml',
			en: '/app/locales/en.yaml',
		},
	});
	const [vi, en] = output;

	expect(vi).toMatchObject({ lang: 'vi', source: '/app/locales/vi.yaml' });
	expect(vi.module).toBeDefined();
	expect(vi.messages.map((m) => m.key)).toEqual(['greeting', 'goodbye', 'component.welcome']);

	expect(en).toMatchObject({ lang: 'en', source: '/app/locales/en.yaml' });
	expect(en.messages.map((m) => m.key)).toEqual(['greeting', 'goodbye', 'component.welcome']);
	expect(en.module).toBeDefined();
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

test('should forward parse message error', async () => {
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
	assert.instanceOf(error, ErrorMessageParse);
	expect(error.cause).toMatchInlineSnapshot(`
		[
		  [ErrorMissingCloseBracker: Missing closing bracket "}}" for parameter "name!..." starting at position 10],
		  [ErrorMissingCloseBracker: Missing closing bracket "}}" for parameter "name!..." starting at position 7],
		]
	`);
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
