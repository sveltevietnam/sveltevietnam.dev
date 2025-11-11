import { error } from '@sveltejs/kit';

import { getRequestEvent, query } from '$app/server';
import { getBackend } from '$lib/backend/utils';

export const getWebMail = query(async () => {
	// verify token
	const { url, params } = getRequestEvent();
	const token = url.searchParams.get('token');
	if (!token || !params.id) {
		// TODO: error logging
		error(401, { code: 'SV000', message: 'Unauthorized access' });
	}
	const backend = getBackend();
	const result = await backend.jwt().verify<{ sub: string; exp: number }>(token);
	if (!result.success) {
		error(401, {
			code: 'SV000',
			message: 'Token is not valid or has expired',
		});
	}

	// get mail
	const mail = await backend.mails().getWebMail(params.id);
	if (!mail) {
		// TODO: error logging
		error(404, {
			code: 'SV000',
			message: 'Mail not found',
		});
	}

	return {
		...mail,
		expiredAt: new Date(result.payload.exp * 1000),
		actorId: result.payload.sub,
	};
});
