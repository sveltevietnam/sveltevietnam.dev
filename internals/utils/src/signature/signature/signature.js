/**
 * @typedef {{
 *   message: string;
 *   secret: string;
 * }} SignatureParams
 */

/**
 * @typedef {SignatureParams & {
 *   signature: string;
 * }} SignatureVerificationParams
 */

/**
 * @internal
 * @param {string} secret - secret key for signing
 * @param {'sign' | 'verify'} usage - key usages for `crypto.subtle.importKey`
 * @returns
 */
async function importKey(secret, usage) {
	return await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		[usage],
	);
}

/**
 * Verify a signature against a provided message & secret
 * @param {SignatureVerificationParams} param0 - data to verify
 * @returns {Promise<boolean>} whether the signature is valid
 */
export async function verify({ message, secret, signature }) {
	const key = await importKey(secret, 'verify');
	const sigBuf = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
	return await crypto.subtle.verify('HMAC', key, sigBuf, new TextEncoder().encode(message));
}

/**
 * Sign a message using the provided secret
 * @param {SignatureParams} param0 - data to sign
 * @returns {Promise<string>} base64 encoded signature
 */
export async function sign({ message, secret }) {
	const key = await importKey(secret, 'sign');
	const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));

	return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
