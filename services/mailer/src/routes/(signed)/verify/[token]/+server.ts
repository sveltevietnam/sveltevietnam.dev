import { json } from '@sveltejs/kit';
import jwt from '@tsndr/cloudflare-worker-jwt';

import { JWT_SECRET } from '$env/static/private';
import { throwMailerSvelteKitError } from '$server/errors';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params: { token } }) => {
	const isValid = await jwt.verify(token, JWT_SECRET);
	if (!isValid) throwMailerSvelteKitError('VERIFY_INVALID_TOKEN');
	return json(true);
};
