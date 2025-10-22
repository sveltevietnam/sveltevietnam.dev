import dedent from 'dedent';
import { test, expect, describe } from 'vitest';

import { createMessage } from '$tests/utils';

import { print } from '../utils';

import { generateMessageFunction } from '.';

const js = dedent;

test('can compile empty message function', () => {
	const message = createMessage('generated', '');
	const { nodes } = generateMessageFunction(message);
	const code = print(nodes, false);
	expect(code).toMatch(js`
		/**
		 * @returns {string}
		 * @__NO_SIDE_EFFECTS__
		 */
		const _generated = () => "";
	`);
});

test('can compile simple message function', () => {
	const message = createMessage('generated', 'Hello, world!');
	const { nodes } = generateMessageFunction(message);
	const code = print(nodes, false);
	expect(code).toMatch(js`
		/**
		 * @returns {string}
		 * @__NO_SIDE_EFFECTS__
		 */
		const _generated = () => "Hello, world!";
	`);
});

describe('can compile with-params message function', () => {
	describe('single param', () => {
		test('no text', () => {
			const message = createMessage('generated', '{{name}}');
			const { nodes } = generateMessageFunction(message);
			const code = print(nodes, false);
			expect(code).toMatch(js`
				/**
				 * @param {{
				    name: string;
				}} params
				 * @returns {string}
				 * @__NO_SIDE_EFFECTS__
				 */
				const _generated = params => params.name;
			`);
		});

		test('at start', () => {
			const message = createMessage('generated', '{{name}}, welcome!');
			const { nodes } = generateMessageFunction(message);
			const code = print(nodes, false);
			expect(code).toMatch(js`
			/**
			 * @param {{
			    name: string;
			}} params
			 * @returns {string}
			 * @__NO_SIDE_EFFECTS__
			 */
			const _generated = params => \`\${params.name}, welcome!\`;
		`);
		});

		test('at middle', () => {
			const message = createMessage('generated', 'Goodbye, {{name}}. See you soon!');
			const { nodes } = generateMessageFunction(message);
			const code = print(nodes, false);
			expect(code).toMatch(js`
				/**
				 * @param {{
				    name: string;
				}} params
				 * @returns {string}
				 * @__NO_SIDE_EFFECTS__
				 */
				const _generated = params => \`Goodbye, \${params.name}. See you soon!\`;
			`);
		});

		test('at end', () => {
			const message = createMessage('generated', 'Welcome, {{name}}');
			const { nodes } = generateMessageFunction(message);
			const code = print(nodes, false);
			expect(code).toMatch(js`
				/**
				 * @param {{
				    name: string;
				}} params
				 * @returns {string}
				 * @__NO_SIDE_EFFECTS__
				 */
				const _generated = params => \`Welcome, \${params.name}\`;
			`);
		});
	});

	describe('multiple params', () => {
		test('consecutive at ends', () => {
			const message = createMessage(
				'generated',
				'{{first}}{{second}}, lorem ipsum, {{third}}{{forth}}',
			);
			const { nodes } = generateMessageFunction(message);
			const code = print(nodes, false);
			expect(code).toMatch(js`
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
				const _generated = params => \`\${params.first}\${params.second}, lorem ipsum, \${params.third}\${params.forth}\`;
			`);
		});

		test('scattered', () => {
			const message = createMessage(
				'generated',
				'{{first}}, this is a {{second}}{{third}} message with {{third}}{{second}} params. {{forth}}',
			);
			const { nodes } = generateMessageFunction(message);
			const code = print(nodes, false);
			expect(code).toMatch(js`
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
				const _generated = params => \`\${params.first}, this is a \${params.second}\${params.third} message with \${params.third}\${params.second} params. \${params.forth}\`;
			`);
		});
	});
});
