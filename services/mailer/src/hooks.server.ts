import { verifyRequest } from '@libs/utils/signature';
import type { Handle } from '@sveltejs/kit';

import { getSecretFromClientId } from '$server/clients/clients.dao';
import { createErrorResponse } from '$server/common/errors';

export const handle: Handle = async ({ event, resolve }) => {
  const { request, route, platform, locals } = event;

  if (!route.id?.includes('projected')) {
    // if public routes, pass through
    return resolve(event);
  }

  // get cloudflare bindings for d1 database
  const d1 = platform?.env?.D1;
  if (!d1) {
    return createErrorResponse('D1_NOT_AVAILABLE');
  }
  locals.d1 = d1;

  // check for client signature
  const clientId = request.headers.get('x-client-id');
  const signature = request.headers.get('x-signature');
  if (!clientId || !signature) {
    return createErrorResponse('MISSING_CLIENT_ID_OR_SIGNATURE');
  }

  const secret = await getSecretFromClientId(d1, clientId);
  if (!secret) {
    // add error capturing
    return createErrorResponse('CLIENT_ID_NOT_FOUND');
  }

  // verify
  const passed = verifyRequest({ request, secret });
  if (!passed) {
    return createErrorResponse('INVALID_SIGNATURE');
  }

  return resolve(event);
};
