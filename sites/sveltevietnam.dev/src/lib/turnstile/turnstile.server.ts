/** https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ */

import { VITE_PRIVATE_CLOUDFLARE_TURNSTILE_SECRET_KEY } from '$env/static/private';

interface TokenValidateResponse {
	'error-codes'?: string[];
	success: boolean;
	action: string;
	cdata: string;
}

const TURNSTILE_SERVER_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function validateToken(token: string, ip?: string) {
	const formData = new FormData();
	formData.append('secret', VITE_PRIVATE_CLOUDFLARE_TURNSTILE_SECRET_KEY);
	formData.append('response', token);
	formData.append('idempotency_key', crypto.randomUUID());
	if (ip) {
		formData.append('remoteip', ip);
	}
	const response = await fetch(TURNSTILE_SERVER_URL, {
		method: 'POST',
		body: formData,
	});
	const data = (await response.json()) as TokenValidateResponse;
	return {
		success: data.success,
		error: data['error-codes'],
	};
}
