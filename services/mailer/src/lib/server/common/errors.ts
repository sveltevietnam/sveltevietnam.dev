import { json } from '@sveltejs/kit';

import type { CommonResponseErrorDTO } from './dto';

export type ErrorSpecs = {
  code: string;
  status: number;
};

export const ERRORS = {
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

  // endpoint level errors
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
} as const satisfies Record<string, ErrorSpecs>;

export function createErrorResponse<E extends keyof typeof ERRORS>(
  error: E,
  message: string[] | string = [],
) {
  // add error capturing
  return json(
    {
      success: false,
      code: ERRORS[error].code,
      errors: typeof message === 'string' ? [message] : message,
    } satisfies CommonResponseErrorDTO,
    {
      status: ERRORS[error].status,
    },
  );
}
