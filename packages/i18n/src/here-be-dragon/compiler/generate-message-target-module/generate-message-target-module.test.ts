import dedent from 'dedent';
import { test, expect } from 'vitest';

import { createMessage } from '$tests/utils';

import { generateMessageTargetModule } from '.';

const js = dedent;

test('empty messages should return empty string', () => {
	expect(generateMessageTargetModule([])).toBe('');
});

test('single message', () => {
	const messages = [createMessage('greeting', 'Hello')];
	const mod = generateMessageTargetModule(messages);
	expect(mod).toMatch(js`
		/**
		 * @returns {string}
		 * @__NO_SIDE_EFFECTS__
		 */
		const _greeting = () => "Hello";
		export { _greeting as "greeting" };
	`);
});

test('multiple messages', () => {
	const messages = [
		createMessage('greeting', 'Hello'),
		createMessage('farewell', 'Goodbye {{name}}'),
	];
	const mod = generateMessageTargetModule(messages);
	expect(mod).toMatch(js`
		/**
		 * @returns {string}
		 * @__NO_SIDE_EFFECTS__
		 */
		const _greeting = () => "Hello";
		/**
		 * @param {{
		    name: string;
		}} params
		 * @returns {string}
		 * @__NO_SIDE_EFFECTS__
		 */
		const _farewell = params => \`Goodbye \${params.name}\`;
		export { _greeting as "greeting", _farewell as "farewell" };
	`);
});
