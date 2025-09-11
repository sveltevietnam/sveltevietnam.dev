import * as v from 'valibot';

/** https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ */

/**
 * @typedef CloudflareTokenValidateResponse
 * @property {boolean} success
 * @property {string} action
 * @property {number} cdata
 * @property {string[]} error-codes
 */

/**
 * @typedef {{ success: true } | { success: false, error: string[] }} CloudflareTokenValidateResult
 */

const TURNSTILE_SERVER_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * @param {string} secret
 * @param {string} token
 * @param {string} [ip]
 * @returns {Promise<CloudflareTokenValidateResult>}
 */
export async function validateCloudflareToken(secret, token, ip) {
	const formData = new FormData();
	formData.append('secret', secret);
	formData.append('response', token);
	formData.append(
		'idempotency_key',
		'crypto' in globalThis ? crypto.randomUUID() : Math.random().toString(36).substring(2),
	);
	if (ip) {
		formData.append('remoteip', ip);
	}
	const response = await fetch(TURNSTILE_SERVER_URL, {
		method: 'POST',
		body: formData,
	});
	const data = /** @type {CloudflareTokenValidateResponse} */ (await response.json());
	return {
		success: data.success,
		error: data['error-codes'],
	};
}

/**
 * @param {{ nonempty: string }} messages
 */
export function createTurnstileValibotClientSchema(messages) {
	return v.pipe(v.string(), v.nonEmpty(messages.nonempty));
}

/**
 * @param {{ secret: string; ip?: string; messages: { nonempty: string; generic: string } }} config
 */
export function createTurnstileValibotServerSchema(config) {
	return v.pipeAsync(
		v.string(),
		v.nonEmpty(config.messages.nonempty),
		// check cloudflare turnstile captcha
		v.rawCheckAsync(async ({ dataset, addIssue }) => {
			const turnstile = await validateCloudflareToken(
				config.secret,
				/** @type {string} */ (dataset.value),
				config.ip,
			);
			if (!turnstile.success) {
				addIssue({
					message: turnstile.error?.[0] ?? config.messages.generic,
				});
			}
		}),
	);
}
