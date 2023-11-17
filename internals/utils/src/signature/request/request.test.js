import { test, expect, describe } from 'vitest';

import { signRequest, verifyRequest } from './request.js';

const SECRET = 'SECRET';
const ALTERED_SECRET = 'ALTEREDSECRET';
const ALTERED_SIGNATURE = 'ALTEREDSIGNATURE';

const URL = 'https://mocking-url.com';
const ALTERED_URL = 'https://mocking-url.com/alter';

const BODY = { foo: 'ba-r' };
const ALTERED_BODY = { foo: 'ba-z' };

const HEADER = 'x-signature';

describe('GET Request:', () => {
	test('a correctly signed request should pass verification', async () => {
		const request = new Request(URL, { method: 'GET' });
		await signRequest({ request, secret: SECRET });
		const valid = await verifyRequest({ request, secret: SECRET });
		expect(valid).toBe(true);
	});

	test('altering url should fail verification', async () => {
		const request = new Request(URL, { method: 'GET' });
		await signRequest({ request, secret: SECRET });

		const alteredRequest = new Request(ALTERED_URL, request);
		const valid = await verifyRequest({ request: alteredRequest, secret: SECRET });

		expect(valid).toBe(false);
	});

	test('altering signature should fail verification', async () => {
		const request = new Request(URL, { method: 'GET' });
		await signRequest({ request, secret: SECRET });

		request.headers.set(HEADER, ALTERED_SIGNATURE);
		const valid = await verifyRequest({ request, secret: SECRET, header: HEADER });

		expect(valid).toBe(false);
	});

	test('altering secret should fail verification', async () => {
		const request = new Request(URL, { method: 'GET' });
		await signRequest({ request, secret: ALTERED_SECRET });
		const valid = await verifyRequest({ request, secret: SECRET });
		expect(valid).toBe(false);
	});
});

describe('POST Request', () => {
	test('a correctly signed request should pass verification', async () => {
		const request = new Request(URL, {
			method: 'POST',
			body: JSON.stringify(BODY),
		});
		await signRequest({ request, secret: SECRET });
		const valid = await verifyRequest({ request, secret: SECRET });
		expect(valid).toBe(true);
	});

	test('empty body should still work', async () => {
		const request = new Request(URL, {
			method: 'POST',
			body: JSON.stringify({}),
		});
		await signRequest({ request, secret: SECRET });
		const valid = await verifyRequest({ request, secret: SECRET });
		expect(valid).toBe(true);
	});

	test('altering body should fail verification', async () => {
		const request = new Request(URL, {
			method: 'POST',
			body: JSON.stringify(BODY),
		});
		await signRequest({ request, secret: SECRET });

		const altered = new Request(URL, {
			method: 'POST',
			body: JSON.stringify(ALTERED_BODY),
		});
		altered.headers.set(HEADER, request.headers.get(HEADER) ?? '');
		const valid = await verifyRequest({ request: altered, secret: SECRET });
		expect(valid).toBe(false);
	});

	test('altering signature should fail verification', async () => {
		const request = new Request(URL, {
			method: 'POST',
			body: JSON.stringify(BODY),
		});
		await signRequest({ request, secret: SECRET });

		request.headers.delete(HEADER);
		const valid = await verifyRequest({ request, secret: SECRET });
		expect(valid).toBe(false);
	});

	test('altering signature should fail verification', async () => {
		const request = new Request(URL, {
			method: 'POST',
			body: JSON.stringify(BODY),
		});
		await signRequest({ request, secret: ALTERED_SECRET });
		const valid = await verifyRequest({ request, secret: SECRET });
		expect(valid).toBe(false);
	});
});
