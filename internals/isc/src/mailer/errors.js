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
  CLIENT_ID_NOT_FOUND: {
    code: 'MS003',
    status: 401,
  },
  INVALID_SIGNATURE: {
    code: 'MS004',
    status: 401,
  },

  // POST `/subscription` endpoint errors
  SUBSCRIPTION_CREATE_INVALID_INPUT: {
    code: 'MS005',
    status: 400,
  },
  SUBSCRIPTION_CREATE_ALREADY_EXISTS: {
    code: 'MS006',
    status: 409,
  },

  // POST `/send` endpoint errors
  SEND_MAILCHANNELS_ERROR: {
    code: 'MS007',
    status: 500,
  },
  SEND_INVALID_INPUT: {
    code: 'MS008',
    status: 400,
  },
  SEND_TEMPLATE_NOT_FOUND: {
    code: 'MS009',
    status: 400,
  },

  // GET `/mail/[token]` endpoint errors
  MAIL_INVALID_TOKEN: {
    code: 'MS010',
    status: 400,
  },
  MAIL_NOT_FOUND: {
    code: 'MS011',
    status: 404,
  },

  // GET `verify/[token]` endpoint errors
  VERIFY_INVALID_TOKEN: {
    code: 'MS012',
    status: 400,
  },

  // PATCH `/subscription` endpoint errors
  SUBSCRIPTION_DOMAIN_UPDATE_NO_TOKEN: {
    code: 'MS013',
    status: 400,
  },
  SUBSCRIPTION_DOMAIN_UPDATE_INVALID_INPUT: {
    code: 'MS014',
    status: 400,
  },
  SUBSCRIPTION_DOMAIN_UPDATE_INVALID_TOKEN: {
    code: 'MS015',
    status: 400,
  },

  // next error code: MS016
};
