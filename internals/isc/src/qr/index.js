import jwt from '@tsndr/cloudflare-worker-jwt';

/**
 * @satisfies {Record<string, import('../common/types').ErrorSpecs>}
 */
export const QR_ERRORS = /* @type {const} */ {
	// service level errors
	UNKNOWN: {
		code: 'QR000',
		status: 500,
	},

	// GET `/?token=...`
	QR_GET_NO_TOKEN: {
		code: 'QR001',
		status: 400,
	},
	QR_GET_INVALID_TOKEN: {
		code: 'QR002',
		status: 401,
	},
	QR_GET_NO_DATA: {
		code: 'QR003',
		status: 400,
	},

	// next error code: QR004
};

/**
 * @typedef {{
 * 	data: string;
 * 	size?: number;
 * }} CreateQrUrlConfig
 */

/**
 * @param {string} origin - the origin of QR service
 * @param {string} secret - JWT secret to encode data
 * @param {CreateQrUrlConfig} config - instructions to create QR code
 * @returns {Promise<string>}
 */
export async function createQrUrl(origin, secret, config) {
	const url = new URL(origin);
	const token = await jwt.sign(
		{
			...config,
			iss: 'qr.sveltevietnam.dev',
			iat: Math.floor(new Date().getTime() / 1000),
		},
		secret,
	);
	url.searchParams.set('token', token);
	return url.toString();
}
