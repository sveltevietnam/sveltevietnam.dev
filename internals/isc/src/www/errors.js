/**
 * @satisfies {Record<string, import('../common/types').ErrorSpecs>}
 */
export const WWW_ERRORS = /* @type {const} */ {
	// service level errors
	UNKNOWN: {
		code: 'WW000',
		status: 500,
	},
	D1_NOT_AVAILABLE: {
		code: 'WW001',
		status: 500,
	},
	ISC_CLIENT_SECRET_NOT_FOUND: {
		code: 'WW002',
		status: 500,
	},

	// events/self-checkin
	EVENT_SELF_CHECKIN_QR_INVALID: {
		code: 'WW003',
		status: 400,
	},

	EVENT_SELF_CHECKIN_QR_MISSING_INFO: {
		code: 'WW004',
		status: 400,
	},

	EVENT_SELF_CHECKIN_FORM_MISSING_INFO: {
		code: 'WW005',
		status: 400,
	},

	EVENT_SELF_CHECKIN_EVENT_NOT_FOUND: {
		code: 'WW006',
		status: 404,
	},

	// next error code: WW007
};
