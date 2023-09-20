import { signRequest } from '@internals/utils/signature';

export const COMMON_HEADERS = {
  TOKEN: 'x-token',
  CLIENT_ID: 'x-client-id',
  CLIENT_SIGNATURE: 'x-client-signature',
};

/**
 *
 * @param {import('./types').ErrorSpecs} error
 * @returns
 */
export function createErrorJSONResponse(error) {
  /** @satisfies {import('./types').CommonErrorResponseDTO} */
  const data = {
    success: false,
    code: error.code,
  };

  const headers = new Headers();
  headers.set('content-type', 'application/json');

  return new Response(JSON.stringify(data), {
    status: error.status,
    headers,
  });
}

/**
 * @internal
 * @param {Request} request
 * @param {Pick<import('./types').CommonRequestConfig, 'clientID' | 'clientSecret'>} config
 * @returns {Promise<Request>}
 */
function signRequestX(request, config) {
  request.headers.set(COMMON_HEADERS.CLIENT_ID, config.clientID);
  return signRequest({
    request,
    secret: config.clientSecret,
    header: COMMON_HEADERS.CLIENT_SIGNATURE,
  });
}

/**
 * @template Data
 * @template {boolean} HasToken
 * @param {string} endpoint
 * @param {RequestInit & { token?: HasToken }} init
 * @returns {import('./types').CommonRequestFactory<Data, HasToken>}
 */
export function createSignedRequestFactory(
  endpoint,
  init = { token: /** @type {HasToken} */ (false) },
) {
  return async function (data, config) {
    const internal = config === 'internal';
    const url = new URL(internal ? 'http://127.0.0.1' : config.serviceURL);
    url.pathname = endpoint;
    let request = new Request(url, {
      method: 'POST',
      ...init,
      body: JSON.stringify(data),
    });
    request.headers.set('content-type', 'application/json');
    if (!internal) {
      request = await signRequestX(request, config);
      if (init?.token) request.headers.set(COMMON_HEADERS.TOKEN, config.token);
    }
    return request;
  };
}

/**
 * @template {boolean} HasToken
 * @param {string} endpoint
 * @param {Omit<RequestInit, 'method'> & { token?: HasToken }} init
 * @returns {import('./types').CommonGetRequestFactory<HasToken>}
 */
export function createSignedGetRequestFactory(
  endpoint,
  init = { token: /** @type {HasToken} */ (false) },
) {
  return async function (config) {
    const internal = config === 'internal';
    const url = new URL(internal ? 'http://127.0.0.1' : config.serviceURL);
    url.pathname = endpoint;
    let request = new Request(url, { method: 'GET', ...init });
    request.headers.set('content-type', 'application/json');
    if (!internal) {
      request = await signRequestX(request, config);
      if (init?.token) request.headers.set(COMMON_HEADERS.TOKEN, config.token);
    }
    return request;
  };
}
