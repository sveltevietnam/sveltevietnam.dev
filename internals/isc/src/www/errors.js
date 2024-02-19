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

	// Event E-Ticket Registration

	// next error code: MS002
};
