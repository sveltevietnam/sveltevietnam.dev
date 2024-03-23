/**
 * @satisfies {Record<string, import('../common/types').ErrorSpecs>}
 */
export const MAILER_ERRORS = /* @type {const} */ {
	// service level errors
	UNKNOWN: {
		code: 'MS000',
		status: 500,
	},
	D1_NOT_AVAILABLE: {
		code: 'MS001',
		status: 500,
	},
	MISSING_CLIENT_ID_OR_SIGNATURE: {
		code: 'MS002',
		status: 404,
	},
	INVALID_ISC_CLIENT: {
		code: 'MS003',
		status: 401,
	},
	ISC_CLIENT_NOT_FOUND: {
		code: 'MS004',
		status: 500,
	},
	INVALID_SIGNATURE: {
		code: 'MS005',
		status: 401,
	},

	// POST `/send` endpoint errors
	SEND_MAILCHANNELS_ERROR: {
		code: 'MS006',
		status: 500,
	},
	SEND_INVALID_INPUT: {
		code: 'MS007',
		status: 400,
	},
	SEND_TEMPLATE_NOT_FOUND: {
		code: 'MS008',
		status: 400,
	},

	// GET `/mails/[token]` endpoint errors
	MAIL_INVALID_TOKEN: {
		code: 'MS009',
		status: 401,
	},
	MAIL_NOT_FOUND: {
		code: 'MS010',
		status: 404,
	},
	// next error code: MS011
};
