import os from 'node:os';

import dedent from 'dedent';
import { vol } from 'memfs';
import { ValiError } from 'valibot';
import { test, expect, describe, beforeEach, vi } from 'vitest';

import { crosspath } from '$tests/utils';

import { ErrorMissingCloseBracket } from '../parse-message-params';

import { ErrorCircularImport, ErrorExpectAbsolutePath, ErrorFileNotFound, parseLocale } from '.';

vi.mock('node:fs');
vi.mock('node:fs/promises');

const yaml = dedent;
const json = dedent.withOptions({ escapeSpecialCharacters: false });

beforeEach(() => {
	// reset the state of in-memory fs
	vol.reset();
});

test('should throw if content does not pass schema validation', async () => {
	vol.fromJSON({
		'/app/locales/locale.yaml': yaml`
    invalidContent: true
		`,
	});
	await expect(parseLocale('/app/locales/locale.yaml')).rejects.toThrow(ValiError);
});

test('empty messages should still pass', async () => {
	vol.fromJSON({
		'/app/locales/locale.yaml': yaml`
    messages: {}
		`,
	});
	const locale = await parseLocale('/app/locales/locale.yaml');
	expect(locale).toMatchInlineSnapshot(json`
		{
		  "dependencies": Set {},
		  "messages": [],
		}
	`);
});

test('should throw if entry is relative path', async () => {
	await expect(parseLocale('./locales/locale.yaml')).rejects.toThrow(ErrorExpectAbsolutePath);
});

test('should throw if entry file does file not found', async () => {
	const rejects = expect(parseLocale('/app/a.yaml')).rejects;
	await rejects.toThrow(ErrorFileNotFound);
	await rejects.toThrowErrorMatchingInlineSnapshot(
		`[ErrorFileNotFound: File not found: "${crosspath('/app/a.yaml')}"]`,
	);
});

test('should forward parse param error', async () => {
	vol.fromJSON({
		'/app/locales/locale.yaml': yaml`
    messages:
      greeting: "Hello, {{name!"
		`,
	});
	const rejects = expect(parseLocale('/app/locales/locale.yaml')).rejects;
	await rejects.toThrow(ErrorMissingCloseBracket);
});

describe('import directive should work', () => {
	describe('from local file', () => {
		const entry = yaml`
    messages:
      foo: bar
      components:
        test:
          goodbye: to be overrided
          '@import': './components/test/locale.yaml'
		`;
		const component = yaml`
    messages:
      hello: world
      goodbye: to be kept
		`;
		test('can import and merge', async () => {
			vol.fromJSON(
				{
					'./locales/locale.yaml': entry,
					'./locales/components/test/locale.yaml': component,
				},
				'/app',
			);
			const locale = await parseLocale('/app/locales/locale.yaml');
			expect(locale).toMatchInlineSnapshot(json`
				{
				  "dependencies": Set {
				    "${crosspath('/app/locales/components/test/locale.yaml')}",
				  },
				  "messages": [
				    {
				      "content": "bar",
				      "key": "foo",
				      "params": [],
				      "sources": [
				        {
				          "content": "bar",
				          "file": "${crosspath('/app/locales/locale.yaml')}",
				        },
				      ],
				    },
				    {
				      "content": "to be kept",
				      "key": "components.test.goodbye",
				      "params": [],
				      "sources": [
				        {
				          "content": "to be overrided",
				          "file": "${crosspath('/app/locales/locale.yaml')}",
				        },
				        {
				          "content": "to be kept",
				          "file": "${crosspath('/app/locales/components/test/locale.yaml')}",
				        },
				      ],
				    },
				    {
				      "content": "world",
				      "key": "components.test.hello",
				      "params": [],
				      "sources": [
				        {
				          "content": "world",
				          "file": "${crosspath('/app/locales/components/test/locale.yaml')}",
				        },
				      ],
				    },
				  ],
				}
			`);
		});

		test('can import path with special characters', async () => {
			vol.fromJSON(
				{
					'./locales/locale.yaml': yaml`
        messages:
          '@import': '../routes/(localized)/[lang=lang]/[[slug]]/locale.yaml'
				`,
					'./routes/(localized)/[lang=lang]/[[slug]]/locale.yaml': yaml`
        messages:
          hello: world
				`,
				},
				'/app',
			);
			const locale = await parseLocale('/app/locales/locale.yaml');
			expect(locale).toMatchInlineSnapshot(json`
				{
				  "dependencies": Set {
				    "${crosspath('/app/routes/(localized)/[lang=lang]/[[slug]]/locale.yaml')}",
				  },
				  "messages": [
				    {
				      "content": "world",
				      "key": "hello",
				      "params": [],
				      "sources": [
				        {
				          "content": "world",
				          "file": "${crosspath('/app/routes/(localized)/[lang=lang]/[[slug]]/locale.yaml')}",
				        },
				      ],
				    },
				  ],
				}
			`);
		});

		test('should throw if file not found', async () => {
			vol.fromJSON(
				{
					'./locales/locale.yaml': entry,
				},
				'/app',
			);
			const rejects = expect(parseLocale('/app/locales/locale.yaml')).rejects;
			await rejects.toThrow(ErrorFileNotFound);
			await rejects.toThrowErrorMatchingInlineSnapshot(
				dedent`[ErrorFileNotFound: File not found: "${crosspath('/app/locales/components/test/locale.yaml')}" (imported by "${crosspath('/app/locales/locale.yaml')}" at "components.test.@import")]`,
			);
		});
	});

	describe('from node module', () => {
		const entry = yaml`
    messages:
      foo: bar
      components:
        test:
          goodbye: to be overrided
          '@import': '@package/external/components/test/locale.yaml'
		`;
		const component = yaml`
    messages:
      hello: world
      goodbye: to be kept
		`;
		test('can import and merge', async () => {
			vol.fromJSON(
				{
					'./locales/locale.yaml': entry,
					'./node_modules/@package/external/package.json': json`{
						"name": "@package/external",
						"exports": {
							"./components/test/*.yaml": "./components/test/*.yaml"
						}
					}`,
					'./node_modules/@package/external/components/test/locale.yaml': component,
				},
				'/app',
			);
			const locale = await parseLocale('/app/locales/locale.yaml');
			expect(locale).toMatchInlineSnapshot(json`
				{
				  "dependencies": Set {
				    "${crosspath('/app/node_modules/@package/external/components/test/locale.yaml')}",
				  },
				  "messages": [
				    {
				      "content": "bar",
				      "key": "foo",
				      "params": [],
				      "sources": [
				        {
				          "content": "bar",
				          "file": "${crosspath('/app/locales/locale.yaml')}",
				        },
				      ],
				    },
				    {
				      "content": "to be kept",
				      "key": "components.test.goodbye",
				      "params": [],
				      "sources": [
				        {
				          "content": "to be overrided",
				          "file": "${crosspath('/app/locales/locale.yaml')}",
				        },
				        {
				          "content": "to be kept",
				          "file": "${crosspath('/app/node_modules/@package/external/components/test/locale.yaml')}",
				        },
				      ],
				    },
				    {
				      "content": "world",
				      "key": "components.test.hello",
				      "params": [],
				      "sources": [
				        {
				          "content": "world",
				          "file": "${crosspath('/app/node_modules/@package/external/components/test/locale.yaml')}",
				        },
				      ],
				    },
				  ],
				}
			`);
		});

		test('should throw if file not found', async () => {
			vol.fromJSON(
				{
					'./locales/locale.yaml': entry,
				},
				'/app',
			);
			const rejects = expect(parseLocale('/app/locales/locale.yaml')).rejects;
			await rejects.toThrow(ErrorFileNotFound);
			await rejects.toThrowErrorMatchingInlineSnapshot(dedent`
				[ErrorFileNotFound: Imported module not found: "@package/external/components/test/locale.yaml" (imported by "${crosspath('/app/locales/locale.yaml')}" at "components.test.@import")]
			`);
		});

		test('should forward import-meta-resolve error', async () => {
			vol.fromJSON(
				{
					'./locales/locale.yaml': yaml`
					  messages:
					    foo:
					      '@import': '@package/external/components/test'
					`,
					'./node_modules/@package/external/package.json': json`{
						"name": "@package/external",
						"exports": {
							"./components/test/*.yaml": "./components/test/*.yaml"
						}
					}`,
				},
				'/app',
			);
			const rejects = expect(parseLocale('/app/locales/locale.yaml')).rejects;
			if (os.platform() === 'win32') {
				await rejects.toThrowErrorMatchingInlineSnapshot(
					`[ErrorFileNotFound: File not found: "C:\\app\\node_modules\\@package\\external\\components\\test" (imported by "C:\\app\\locales\\locale.yaml" at "foo.@import")]`,
				);
			} else {
				await rejects.toThrowErrorMatchingInlineSnapshot(
					`[Error: Package subpath './components/test' is not defined by "exports" in /app/node_modules/@package/external/package.json imported from /app/locales/locale.yaml]`,
				);
			}
		});
	});

	test('can use custom directive', async () => {
		vol.fromJSON(
			{
				'./locales/locale.yaml': yaml`
        messages:
          foo: bar
          components:
            test:
              ...: './components/test/locale.yaml'
				`,
				'./locales/components/test/locale.yaml': yaml`
        messages:
          hello: world
				`,
			},
			'/app',
		);
		const locale = await parseLocale('/app/locales/locale.yaml', {
			import: {
				directive: '...',
			},
		});
		expect(locale).toMatchInlineSnapshot(json`
			{
			  "dependencies": Set {
			    "${crosspath('/app/locales/components/test/locale.yaml')}",
			  },
			  "messages": [
			    {
			      "content": "bar",
			      "key": "foo",
			      "params": [],
			      "sources": [
			        {
			          "content": "bar",
			          "file": "${crosspath('/app/locales/locale.yaml')}",
			        },
			      ],
			    },
			    {
			      "content": "world",
			      "key": "components.test.hello",
			      "params": [],
			      "sources": [
			        {
			          "content": "world",
			          "file": "${crosspath('/app/locales/components/test/locale.yaml')}",
			        },
			      ],
			    },
			  ],
			}
		`);
	});

	test('can use import alias', async () => {
		vol.fromJSON(
			{
				'./locales/locale.yaml': yaml`
        messages:
          foo: bar
          components:
            test:
              goodbye: to be overrided
              '@import': '#components/test/locale.yaml'
				`,
				'./locales/components/test/locale.yaml': yaml`
        messages:
          hello: world
          goodbye: to be kept
				`,
			},
			'/app',
		);
		const locale = await parseLocale('/app/locales/locale.yaml', {
			import: {
				alias: [
					{
						find: '#components/',
						replacement: '/app/locales/components/',
					},
				],
			},
		});
		expect(locale).toMatchInlineSnapshot(json`
			{
			  "dependencies": Set {
			    "${crosspath('/app/locales/components/test/locale.yaml')}",
			  },
			  "messages": [
			    {
			      "content": "bar",
			      "key": "foo",
			      "params": [],
			      "sources": [
			        {
			          "content": "bar",
			          "file": "${crosspath('/app/locales/locale.yaml')}",
			        },
			      ],
			    },
			    {
			      "content": "to be kept",
			      "key": "components.test.goodbye",
			      "params": [],
			      "sources": [
			        {
			          "content": "to be overrided",
			          "file": "${crosspath('/app/locales/locale.yaml')}",
			        },
			        {
			          "content": "to be kept",
			          "file": "${crosspath('/app/locales/components/test/locale.yaml')}",
			        },
			      ],
			    },
			    {
			      "content": "world",
			      "key": "components.test.hello",
			      "params": [],
			      "sources": [
			        {
			          "content": "world",
			          "file": "${crosspath('/app/locales/components/test/locale.yaml')}",
			        },
			      ],
			    },
			  ],
			}
		`);
	});

	test('should throw when detecting the first circular dependency', async () => {
		vol.fromJSON(
			{
				'./a.yaml': yaml`
        messages:
          b:
            '@import': './b.yaml'
          c:
            '@import': './c.yaml'
				`,
				'./b.yaml': yaml`
        messages:
          a:
            '@import': './a.yaml'
				`,
				'./c.yaml': yaml`
        messages:
          a:
            '@import': './a.yaml'
				`,
			},
			'/app',
		);
		const rejects = expect(parseLocale('/app/a.yaml')).rejects;
		await rejects.toThrow(ErrorCircularImport);
		await rejects.toThrowErrorMatchingInlineSnapshot(
			dedent`
				[ErrorCircularImport: Circular import detected:
					${crosspath('/app/b.yaml')} (at "b.a.@import") <- ${crosspath('/app/a.yaml')} (at "b.@import")]
			`.replace(/[\t\n]+/g, ' '),
		);
	});
});

describe('custom options should work', () => {
	test('rootKey should be applied', async () => {
		vol.fromJSON({
			'/app/locales/locale.yaml': yaml`
      messages:
        foo: bar
			`,
		});

		const locale = await parseLocale('/app/locales/locale.yaml', {
			rootKey: 'root',
		});
		expect(locale).toMatchInlineSnapshot(json`
			{
			  "dependencies": Set {},
			  "messages": [
			    {
			      "content": "bar",
			      "key": "root.foo",
			      "params": [],
			      "sources": [
			        {
			          "content": "bar",
			          "file": "${crosspath('/app/locales/locale.yaml')}",
			        },
			      ],
			    },
			  ],
			}
		`);
	});

	test('custom parser should be used', async () => {
		vol.fromJSON(
			{
				'/app/locales/locale.json': json`{
					"messages": {
						"hello": "world"
					}
				}`,
			},
			'/app',
		);
		const options: Parameters<typeof parseLocale>[1] = {
			deserializer: {
				parse: ({ content }) => JSON.parse(content),
			},
		};
		const deserializerParseSpy = vi.spyOn(options.deserializer!, 'parse');
		const locale = await parseLocale('/app/locales/locale.json', options);
		expect(locale).toMatchInlineSnapshot(json`
			{
			  "dependencies": Set {},
			  "messages": [
			    {
			      "content": "world",
			      "key": "hello",
			      "params": [],
			      "sources": [
			        {
			          "content": "world",
			          "file": "${crosspath('/app/locales/locale.json')}",
			        },
			      ],
			    },
			  ],
			}
		`);
		expect(deserializerParseSpy).toHaveBeenCalledOnce();
	});
});
