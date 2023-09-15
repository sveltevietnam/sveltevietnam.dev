import { json } from '@sveltejs/kit';

export const MAIL_SERVICE_ERRORS = {
  // service level errors
  UNKNOWN: ['MS000', 500] as const,
  D1_NOT_AVAILABLE: ['MS001', 500] as const,
  MISSING_CLIENT_ID_OR_SIGNATURE: ['MS002', 404] as const,
  CLIENT_ID_NOT_FOUND: ['MS003', 401] as const,
  INVALID_SIGNATURE: ['MS004', 401] as const,
} as const satisfies Record<string, [string, number]>;

export function createErrorResponse<E extends keyof typeof MAIL_SERVICE_ERRORS>(
  error: E,
  message: string[] | string = [],
) {
  // add error capturing
  return json(
    {
      code: MAIL_SERVICE_ERRORS[error][0],
      errors: typeof message === 'string' ? [message] : message,
    },
    {
      status: MAIL_SERVICE_ERRORS[error][1],
    },
  );
}
