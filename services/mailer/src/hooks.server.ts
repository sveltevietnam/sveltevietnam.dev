import { COMMON_HEADERS } from '@internals/isc/common';
import { MAILER_ERRORS } from '@internals/isc/mailer';
import { verifyRequest } from '@internals/utils/signature';
import type { Handle, HandleServerError } from '@sveltejs/kit';

import { building } from '$app/environment';
import { getSecretFromClientId } from '$server/daos/clients.dao';
import { createMailerSvelteKitError } from '$server/errors';

export const handle: Handle = async ({ event, resolve }) => {
  if (building) return resolve(event);

  const { request, route, platform, locals } = event;

  // get cloudflare bindings for d1 database
  const d1 = platform?.env?.D1;
  if (!d1) throw createMailerSvelteKitError('D1_NOT_AVAILABLE');
  locals.d1 = d1;

  // if public routes, pass through
  if (!route.id?.includes('signed')) return resolve(event);

  // internal requests, pass through
  if (event.isSubRequest) return resolve(event);

  // check for client signature
  const clientId = request.headers.get(COMMON_HEADERS.CLIENT_ID);
  const signature = request.headers.get(COMMON_HEADERS.CLIENT_SIGNATURE);
  if (!clientId || !signature) throw createMailerSvelteKitError('MISSING_CLIENT_ID_OR_SIGNATURE');

  const secret = await getSecretFromClientId(d1, clientId);
  if (!secret) throw createMailerSvelteKitError('CLIENT_ID_NOT_FOUND');

  // verify
  const passed = await verifyRequest({ request, secret, header: COMMON_HEADERS.CLIENT_SIGNATURE });
  if (!passed) throw createMailerSvelteKitError('INVALID_SIGNATURE');

  return resolve(event);
};

export const handleError: HandleServerError = async ({ error }) => {
  // TODO: add error capturing
  console.error(`Internal Error`, error);
  return {
    code: (error as App.Error)?.code ?? MAILER_ERRORS.UNKNOWN.code,
    message: (error as App.Error).code ?? MAILER_ERRORS.UNKNOWN.code,
  };
};
