import jwt from '@tsndr/cloudflare-worker-jwt';

import { JWT_SECRET } from '$env/static/private';
import { getMailById } from '$server/daos/mails.dao';
import { throwMailerSvelteKitError } from '$server/errors';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params: { token } }) => {
	const isValid = await jwt.verify(token, JWT_SECRET);
	if (!isValid) throwMailerSvelteKitError('MAIL_INVALID_TOKEN');
	const { payload } = jwt.decode(token);
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
