import { createMailerErrorResponse } from '@internals/isc/mailer';
import { verifyRequest } from '@internals/utils/signature';
import type { Handle } from '@sveltejs/kit';

import { getSecretFromClientId } from '$server/daos/clients.dao';

export const handle: Handle = async ({ event, resolve }) => {
  const { request, route, platform, locals } = event;

  if (!route.id?.includes('protected')) {
    // if public routes, pass through
    return resolve(event);
  }

  // get cloudflare bindings for d1 database
  const d1 = platform?.env?.D1;
  if (!d1) {
    return createMailerErrorResponse('D1_NOT_AVAILABLE');
  }
  locals.d1 = d1;

  if (event.isSubRequest) {
    // internal requests, pass through
    return resolve(event);
  }

  // check for client signature
  const clientId = request.headers.get('x-client-id');
  const signature = request.headers.get('x-signature');
  if (!clientId || !signature) {
    return createMailerErrorResponse('MISSING_CLIENT_ID_OR_SIGNATURE');
  }

  const secret = await getSecretFromClientId(d1, clientId);
  if (!secret) {
    // add error capturing
    return createMailerErrorResponse('CLIENT_ID_NOT_FOUND');
  }

  // verify
  const passed = await verifyRequest({ request, secret });
  if (!passed) {
    return createMailerErrorResponse('INVALID_SIGNATURE');
  }

  return resolve(event);
};
