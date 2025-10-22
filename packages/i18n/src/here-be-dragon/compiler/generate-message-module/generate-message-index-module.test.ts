import dedent from 'dedent';
import { test, expect } from 'vitest';

import { createMessage } from '$tests/utils';

import { generateMessageModule } from '.';

const js = dedent;
const langs = ['vi', 'en'];

test('no message should return empty string', () => {
	expect(generateMessageModule([], langs)).toBe('');
});

test('can generate module with only simple message', () => {
	const messages = [createMessage('greeting', 'Hello, world!')];
	const mod = generateMessageModule(messages, langs);
	expect(mod).toMatch(js`
		import { createMessageSimple } from "@sveltevietnam/i18n/runtime/factory";

		import * as vi from "./vi.js";
		import * as en from "./en.js";

		const _greeting = /*@__PURE__*/ createMessageSimple("greeting", {
		    vi: vi["greeting"],
		    en: en["greeting"]
		})
		export { _greeting as "greeting" };
	`);
});

test('can generate module with only with-params message', () => {
	const messages = [createMessage('farewell', 'Goodbye {{name}}')];
	const mod = generateMessageModule(messages, langs);
	expect(mod).toMatch(js`
		import { createMessageWithParams } from "@sveltevietnam/i18n/runtime/factory";

		import * as vi from "./vi.js";
		import * as en from "./en.js";

		const _farewell = /*@__PURE__*/ createMessageWithParams("farewell", {
		    vi: vi["farewell"],
		    en: en["farewell"]
		})
		export { _farewell as "farewell" };
	`);
});

test('can generate module with all types of message', () => {
	const messages = [
		createMessage('greeting', 'Hello, world!'),
		createMessage('farewell', 'Goodbye {{name}}'),
	];
	const mod = generateMessageModule(messages, langs);
	expect(mod).toMatch(js`
		import { createMessageSimple, createMessageWithParams } from "@sveltevietnam/i18n/runtime/factory";

		import * as vi from "./vi.js";
		import * as en from "./en.js";

		const _greeting = /*@__PURE__*/ createMessageSimple("greeting", {
		    vi: vi["greeting"],
		    en: en["greeting"]
		})
		const _farewell = /*@__PURE__*/ createMessageWithParams("farewell", {
		    vi: vi["farewell"],
		    en: en["farewell"]
		})
		export { _greeting as "greeting", _farewell as "farewell" };
	`);
});
