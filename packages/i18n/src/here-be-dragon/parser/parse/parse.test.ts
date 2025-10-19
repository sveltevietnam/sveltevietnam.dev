import dedent from 'dedent';
import { vol } from 'memfs';
import { ValiError } from 'valibot';
import { test, expect, describe, beforeEach, vi } from 'vitest';

import { ErrorCircularImport, ErrorExpectAbsolutePath, ErrorFileNotFound, parse } from './parse';

vi.mock('node:fs');
vi.mock('node:fs/promises');

const yaml = dedent;
const json = dedent;

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
	await expect(parse('/app/locales/locale.yaml')).rejects.toThrow(ValiError);
});

test('should throw if entry is relative path', async () => {
	await expect(parse('./locales/locale.yaml')).rejects.toThrow(ErrorExpectAbsolutePath);
});

test('should throw if entry file does not exist', async () => {
	const rejects = expect(parse('/app/a.yaml')).rejects;
	await rejects.toThrow(ErrorFileNotFound);
	await rejects.toThrowErrorMatchingInlineSnapshot(
		'[ErrorFileNotFound: File not found: "/app/a.yaml"]',
	);
});

describe('import directive should work', () => {
	describe('from local file', () => {
		const entry = yaml`
		  messages:
		    foo: bar
		    components:
		      test:
		        '@import': './components/test/locale.yaml'
		`;
		const component = yaml`
		  messages:
		    hello: world
		`;
		test('can import', async () => {
			vol.fromJSON(
				{
					'./locales/locale.yaml': entry,
					'./locales/components/test/locale.yaml': component,
				},
				'/app',
			);
			const locale = await parse('/app/locales/locale.yaml');
			expect(locale).toEqual({
				foo: 'bar',
				'components.test.hello': 'world',
			});
		});

		test('should throw if not exist', async () => {
			vol.fromJSON(
				{
					'./locales/locale.yaml': entry,
				},
				'/app',
			);
			const rejects = expect(parse('/app/locales/locale.yaml')).rejects;
			await rejects.toThrow(ErrorFileNotFound);
			await rejects.toThrowErrorMatchingInlineSnapshot(dedent`
				[ErrorFileNotFound: File not found: "/app/locales/components/test/locale.yaml" (imported by "/app/locales/components/test/locale.yaml" at "components.test.@import")]
			`);
		});
	});

	describe('from absolute path', () => {
		const entry = yaml`
		  messages:
		    foo: bar
		    components:
		      test:
		        '@import': '@package/external/components/test/locale.yaml'
		`;
		const component = yaml`
		  messages:
		    hello: world
		`;
		test('can import from node module', async () => {
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
			const locale = await parse('/app/locales/locale.yaml');
			expect(locale).toEqual({
				foo: 'bar',
				'components.test.hello': 'world',
			});
		});

		test('should throw if not found', async () => {
			vol.fromJSON(
				{
					'./locales/locale.yaml': entry,
				},
				'/app',
			);
			const rejects = expect(parse('/app/locales/locale.yaml')).rejects;
			await rejects.toThrow(ErrorFileNotFound);
			await rejects.toThrowErrorMatchingInlineSnapshot(dedent`
				[ErrorFileNotFound: Imported module not found: "@package/external/components/test/locale.yaml" (imported by "/app/locales/locale.yaml" at "components.test.@import")]
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
			const rejects = expect(parse('/app/locales/locale.yaml')).rejects;
			await rejects.toThrowErrorMatchingInlineSnapshot(
				`[Error: Package subpath './components/test' is not defined by "exports" in /app/node_modules/@package/external/package.json imported from /app/locales/locale.yaml]`,
			);
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
		const locale = await parse('/app/locales/locale.yaml', {
			directive: {
				import: '...',
			},
		});
		expect(locale).toEqual({
			foo: 'bar',
			'components.test.hello': 'world',
		});
	});

	test('should throw when detecting the first cicular dependency', async () => {
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
		const rejects = expect(parse('/app/a.yaml')).rejects;
		await rejects.toThrow(ErrorCircularImport);
		await rejects.toThrowErrorMatchingInlineSnapshot(
			dedent`
			[ErrorCircularImport: Circular import detected:
				/app/b.yaml (at "b.a.b.@import")
				<- /app/a.yaml (at "b.a.@import")
				<- /app/b.yaml (at "b.@import")]
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

		const locale = await parse('/app/locales/locale.yaml', {
			rootKey: 'root',
		});
		expect(locale).toEqual({ 'root.foo': 'bar' });
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
		const options: Parameters<typeof parse>[1] = {
			deserializer: {
				parse: ({ content }) => JSON.parse(content),
			},
		};
		const deserializerParseSpy = vi.spyOn(options.deserializer!, 'parse');
		const locale = await parse('/app/locales/locale.json', options);
		expect(locale).toEqual({ hello: 'world' });
		expect(deserializerParseSpy).toHaveBeenCalledOnce();
	});
});
