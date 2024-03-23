import { getIscClientSecret } from '@internals/db/daos/isc_clients';
import { getMailById } from '@internals/db/daos/mails';
import jwt from '@tsndr/cloudflare-worker-jwt';

import { ISC_MAILER_CLIENT_ID } from '$env/static/private';
import { throwMailerSvelteKitError } from '$server/errors';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params: { token } }) => {
	const clientSecret = await getIscClientSecret(locals.d1, ISC_MAILER_CLIENT_ID);
	if (!clientSecret) throwMailerSvelteKitError('ISC_CLIENT_NOT_FOUND');

	const isValid = await jwt.verify(token, clientSecret);
	if (!isValid) throwMailerSvelteKitError('MAIL_INVALID_TOKEN');
	const { payload } = jwt.decode<{ id: string }>(token);
	const id = payload?.id as string;

	if (!id) throwMailerSvelteKitError('MAIL_NOT_FOUND');
	const mail = await getMailById(locals.d1, id);
	if (!mail) throwMailerSvelteKitError('MAIL_NOT_FOUND');

	return new Response(mail.html, {
		headers: {
			'Content-Type': 'text/html',
		},
	});
};
