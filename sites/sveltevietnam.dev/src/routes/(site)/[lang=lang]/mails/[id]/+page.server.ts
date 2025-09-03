import { error } from '@sveltejs/kit';

import * as p from '$data/routes/generated';
import { getBackend } from '$lib/backend/utils';
import { update } from '$lib/forms/subscriber/server';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { url, params, locals } = event;
	const token = url.searchParams.get('token');
	if (!token) {
		error(401, { code: 'SV002', message: 'Unauthorized access' });
	}
	const backend = getBackend(event);
	const result = await backend.verify(token);
	if (!result.success) {
		error(401, {
			code: 'SV003',
			message: 'Token is not valid or has expired',
		});
	}

	const { sub: actorId, exp } = result.payload;

	const [subscriber, mail] = await Promise.all([
		actorId.startsWith('subscriber_') ? backend.subscribers().getById(actorId) : null,
		backend.mails().getWebMail(params.id),
	]);

	if (!mail) {
		error(404, {
			code: 'SV005',
			message: 'Mail not found',
		});
	}

	const { html, ...rest } = mail;
	return {
		routing: {
			paths: {
				vi: p['/:lang/mails/:id']({ lang: 'vi', id: params.id }) + `?token=${token}`,
				en: p['/:lang/mails/:id']({ lang: 'en', id: params.id }) + `?token=${token}`,
			},
		},
		expiresAt: new Date(exp * 1000),
		subscriber,
		mail: rest,
		srcdoc: html,
		form: subscriber ? await update.load(locals.language, subscriber) : null,
	};
};

export const actions: Actions = {
	update: update.action,
};
