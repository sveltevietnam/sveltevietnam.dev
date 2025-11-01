import dedent from 'dedent';
import { test, expect } from 'vitest';

import { createSourceMessage } from '$tests/utils';

import { print } from '../utils';

import { generateMessage } from '.';

const js = dedent;
const langs = ['vi', 'en'];

test('can generate for simple message', () => {
	const message = createSourceMessage('greeting', 'Hello, world!');
	const { nodes } = generateMessage(message, langs);
	const code = print(nodes, false);
	expect(code).toEqual(js`
		const _greeting = /*@__PURE__*/ createMessageSimple("greeting", {
		    "en": en["greeting"],
		    "vi": vi["greeting"]
		})\n
	`);
});

test('can generate for with-params message', () => {
	const message = createSourceMessage('farewell', 'Goodbye {{name}}');
	const { nodes } = generateMessage(message, langs);
	const code = print(nodes, false);
	expect(code).toEqual(js`
		const _farewell = /*@__PURE__*/ createMessageWithParams("farewell", {
		    "en": en["farewell"],
		    "vi": vi["farewell"]
		})\n
	`);
});

test('can generate for lang with subtag', () => {
	const message = createSourceMessage('greeting', 'Hello, world!');
	const { nodes } = generateMessage(message, ['en-US', 'en-GB', 'vi']);
	const code = print(nodes, false);
	expect(code).toEqual(js`
		const _greeting = /*@__PURE__*/ createMessageSimple("greeting", {
		    "en-GB": en_GB["greeting"],
		    "en-US": en_US["greeting"],
		    "vi": vi["greeting"]
		})\n
	`);
});
