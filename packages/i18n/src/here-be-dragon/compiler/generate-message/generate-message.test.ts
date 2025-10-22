import dedent from 'dedent';
import { test, expect } from 'vitest';

import { createMessage } from '$tests/utils';

import { print } from '../utils';

import { generateMessage } from '.';

const js = dedent;
const langs = ['vi', 'en'];

test('can generate for simple message', () => {
	const message = createMessage('greeting', 'Hello, world!');
	const { nodes } = generateMessage(message, langs);
	const code = print(nodes, false);
	expect(code).toMatch(js`
		const _greeting = /*@__PURE__*/ createMessageSimple("greeting", {
		    vi: vi["greeting"],
		    en: en["greeting"]
		})
	`);
});

test('can generate for with-params message', () => {
	const message = createMessage('farewell', 'Goodbye {{name}}');
	const { nodes } = generateMessage(message, langs);
	const code = print(nodes, false);
	expect(code).toMatch(js`
		const _farewell = /*@__PURE__*/ createMessageWithParams("farewell", {
		    vi: vi["farewell"],
		    en: en["farewell"]
		})
	`);
});
