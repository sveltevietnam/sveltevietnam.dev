import dedent from 'dedent';
import { test, expect, describe } from 'vitest';

import { createSourceMessage } from '$tests/utils';

import { print } from '../utils';

import { generateMessageTarget } from '.';

const js = dedent;

test('can generate empty message function', () => {
	const message = createSourceMessage('generated', '');
	const { nodes } = generateMessageTarget(message);
	const code = print(nodes, false);
	expect(code).toEqual(js`
		/**
		 * @returns {string}
		 * @__NO_SIDE_EFFECTS__
		 */
		const _generated = () => "";\n
	`);
});

test('can generate simple message function', () => {
	const message = createSourceMessage('generated', 'Hello, world!');
	const { nodes } = generateMessageTarget(message);
	const code = print(nodes, false);
	expect(code).toEqual(js`
		/**
		 * @returns {string}
		 * @__NO_SIDE_EFFECTS__
		 */
		const _generated = () => "Hello, world!";\n
	`);
});

test('should corectly escape _ in key', () => {
	const message = createSourceMessage('key_with_underscore', 'Key with underscore');
	const { nodes } = generateMessageTarget(message);
	const code = print(nodes, false);
	expect(code).toEqual(js`
		/**
		 * @returns {string}
		 * @__NO_SIDE_EFFECTS__
		 */
		const _key__with__underscore = () => "Key with underscore";\n
	`);
});

describe('can generate with-params message function', () => {
	describe('single param', () => {
		test('no text', () => {
			const message = createSourceMessage('generated', '{{name}}');
			const { nodes } = generateMessageTarget(message);
			const code = print(nodes, false);
			expect(code).toEqual(js`
				/**
				 * @param {{
				    name: string;
				}} params
				 * @returns {string}
				 * @__NO_SIDE_EFFECTS__
				 */
				const _generated = params => params.name;\n
			`);
		});

		test('at start', () => {
			const message = createSourceMessage('generated', '{{name}}, welcome!');
			const { nodes } = generateMessageTarget(message);
			const code = print(nodes, false);
			expect(code).toEqual(js`
			/**
			 * @param {{
			    name: string;
			}} params
			 * @returns {string}
			 * @__NO_SIDE_EFFECTS__
			 */
			const _generated = params => \`\${params.name}, welcome!\`;\n
		`);
		});

		test('at middle', () => {
			const message = createSourceMessage('generated', 'Goodbye, {{name}}. See you soon!');
			const { nodes } = generateMessageTarget(message);
			const code = print(nodes, false);
			expect(code).toEqual(js`
				/**
				 * @param {{
				    name: string;
				}} params
				 * @returns {string}
				 * @__NO_SIDE_EFFECTS__
				 */
				const _generated = params => \`Goodbye, \${params.name}. See you soon!\`;\n
			`);
		});

		test('at end', () => {
			const message = createSourceMessage('generated', 'Welcome, {{name}}');
			const { nodes } = generateMessageTarget(message);
			const code = print(nodes, false);
			expect(code).toEqual(js`
				/**
				 * @param {{
				    name: string;
				}} params
				 * @returns {string}
				 * @__NO_SIDE_EFFECTS__
				 */
				const _generated = params => \`Welcome, \${params.name}\`;\n
			`);
		});
	});

	describe('multiple params', () => {
		test('consecutive at ends', () => {
			const message = createSourceMessage(
				'generated',
				'{{first}}{{second}}, lorem ipsum, {{third}}{{forth}}',
			);
			const { nodes } = generateMessageTarget(message);
			const code = print(nodes, false);
			expect(code).toEqual(js`
				/**
				 * @param {{
				    first: string;
				    second: string;
				    third: string;
				    forth: string;
				}} params
				 * @returns {string}
				 * @__NO_SIDE_EFFECTS__
				 */
				const _generated = params => \`\${params.first}\${params.second}, lorem ipsum, \${params.third}\${params.forth}\`;\n
			`);
		});

		test('scattered', () => {
			const message = createSourceMessage(
				'generated',
				'{{first}}, this is a {{second}}{{third}} message with {{third}}{{second}} params. {{forth}}',
			);
			const { nodes } = generateMessageTarget(message);
			const code = print(nodes, false);
			expect(code).toEqual(js`
				/**
				 * @param {{
				    first: string;
				    second: string;
				    third: string;
				    forth: string;
				}} params
				 * @returns {string}
				 * @__NO_SIDE_EFFECTS__
				 */
				const _generated = params => \`\${params.first}, this is a \${params.second}\${params.third} message with \${params.third}\${params.second} params. \${params.forth}\`;\n
			`);
		});
	});
});
