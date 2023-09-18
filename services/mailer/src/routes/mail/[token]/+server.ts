import { createMailerErrorResponse } from '@internals/isc/mailer';
import { error } from '@sveltejs/kit';
import jwt from '@tsndr/cloudflare-worker-jwt';

import { JWT_SECRET } from '$env/static/private';
import { getMailById } from '$server/daos/mails.dao';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params: { token } }) => {
  let id: string | null = null;
  try {
    const isValid = await jwt.verify(token, JWT_SECRET);
    if (!isValid) return createMailerErrorResponse('MAIL_INVALID_TOKEN');
    const { payload } = jwt.decode(token);
    id = payload.id;
  } catch (e) {
    return createMailerErrorResponse('MAIL_UNKNOWN_ERROR');
  }

  if (!id) throw error(404);
  const mail = await getMailById(locals.d1, id);
  if (!mail) throw error(404);

  return new Response(mail.html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};
