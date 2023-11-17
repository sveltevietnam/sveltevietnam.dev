import { test, expect } from 'vitest';

import { sign, verify } from './signature.js';

const SECRET = 'SECRET';
const WRONG_SECRET = 'WRONG_SECRET';
const MESSAGE = 'MESSAGE';
const ALTERED_MESSAGE = 'ALTERED_MESSAGE';

test('a correctly signed signature should pass verification', async () => {
	const signature = await sign({ message: MESSAGE, secret: SECRET });
	const valid = await verify({ message: MESSAGE, signature, secret: SECRET });
	expect(valid).toBe(true);
});

test('altering message should fail verification', async () => {
	const signature = await sign({ message: MESSAGE, secret: SECRET });
	const valid = await verify({ message: ALTERED_MESSAGE, signature, secret: SECRET });
	expect(valid).toBe(false);
});

test('using a wrong signature should fail verification', async () => {
	const signature = await sign({ message: MESSAGE, secret: WRONG_SECRET });
	const valid = await verify({ message: MESSAGE, signature, secret: SECRET });
	expect(valid).toBe(false);
});
