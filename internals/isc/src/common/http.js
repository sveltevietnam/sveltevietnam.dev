import { signRequest } from '@internals/utils/signature';

/**
 *
 * @param {import('./types').ErrorSpecs} error
 * @param {string | string[]} [message]
 * @returns
 */
export function createErrorResponse(error, message = []) {
  /** @satisfies {import('./types').CommonErrorResponseDTO} */
  const data = {
    success: false,
    code: error.code,
    errors: typeof message === 'string' ? [message] : message,
  };

  const headers = new Headers();
  headers.set('content-type', 'application/json');

  return new Response(JSON.stringify(data), {
    status: error.status,
    headers,
  });
}

/**
 * @internals
 * @param {Request} request
 * @param {Pick<import('./types').CommonRequestConfig, 'clientID' | 'clientSecret'>} config
 * @returns {Promise<Request>}
 */
function signRequestX(request, config) {
  request.headers.set('x-client-id', config.clientID);
  return signRequest({
    request,
    secret: config.clientSecret,
  });
}

/**
 * @template Data
 * @param {string} endpoint
 * @param {RequestInit} init
 * @returns {import('./types').CommonRequestFactory<Data>}
 */
export function createRequestFactory(endpoint, init = {}) {
  return function (data, config) {
    const request = new Request(endpoint, {
      method: 'POST',
      ...init,
      body: JSON.stringify(data),
    });
    return signRequestX(request, config);
  };
}
