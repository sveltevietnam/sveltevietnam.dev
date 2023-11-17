/**
 * @typedef {{
 *   request: Request;
 *   secret: string;
 *   header?: string;
 * }} RequestSignatureParams
 */

import { sign, verify } from '../signature/signature.js';

/**
 * @internal
 * Extract a message from a request, that is the URL for GET requests and the body as text for other methods
 * @param {Request} request
 * @returns {Promise<string>}
 */
async function getMessageFromRequest(request) {
	request = request.clone();
	if (request.method === 'GET') {
		return new URL(request.url).toString();
	} else {
		return await request.text();
	}
}

/**
 * Sign a request with the provided secret
 * @param {RequestSignatureParams} param0
 * @returns {Promise<Request>} signed request
 */
export async function signRequest({ request, secret, header = 'x-signature' }) {
	const message = await getMessageFromRequest(request);
	const signature = await sign({ message, secret });
	request.headers.set(header, signature);
	return request;
}

/**
 * Verify a request signature against the provided secret
 * @param {RequestSignatureParams} param0
 * @returns
 */
export async function verifyRequest({ request, secret, header = 'x-signature' }) {
	const message = await getMessageFromRequest(request);
	const signature = request.headers.get(header) ?? '';

	return await verify({ message, signature, secret });
}
