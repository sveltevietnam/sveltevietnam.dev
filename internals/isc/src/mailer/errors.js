import { createErrorResponse } from '../common/http.js';

/**
 * @satisfies {Record<string, import('../common/types').ErrorSpecs>}
 */
export const MAILER_SUBSCRIPTION_ERRORS = /* @type {const} */ {
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

  // POST `/subscribe` endpoint errors
  SUBSCRIPTION_UNKNOWN_ERROR: {
    code: 'MS005',
    status: 500,
  },
  SUBSCRIPTION_INVALID_INPUT: {
    code: 'MS006',
    status: 400,
  },
  SUBSCRIPTION_EXISTS: {
    code: 'MS007',
    status: 409,
  },

  // POST `/send` endpoint errors
  SEND_UNKNOWN_ERROR: {
    code: 'MS008',
    status: 500,
  },
  SEND_INVALID_INPUT: {
    code: 'MS009',
    status: 400,
  },
  SEND_TEMPLATE_NOT_FOUND: {
    code: 'MS010',
    status: 400,
  },

  // GET `/mail/[token]` endpoint errors
  MAIL_UNKNOWN_ERROR: {
    code: 'MS011',
    status: 500,
  },
  MAIL_INVALID_TOKEN: {
    code: 'MS012',
    status: 400,
  },
};

/**
 *
 * @param {keyof typeof MAILER_SUBSCRIPTION_ERRORS} error
 * @param {string | string[]} [message]
 * @returns
 */
export function createMailerErrorResponse(error, message = []) {
  return createErrorResponse(MAILER_SUBSCRIPTION_ERRORS[error], message);
}
