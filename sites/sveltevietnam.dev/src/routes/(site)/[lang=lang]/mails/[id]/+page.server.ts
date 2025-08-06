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

	const { sub: subscriberId, exp } = result.payload;
	const [subscriber, mail] = await Promise.all([
		backend.subscribers().getById(subscriberId),
		backend.mails().getWebMail(params.id),
	]);

	if (!subscriber) {
		error(404, {
			code: 'SV004',
			message: 'Subscriber not found',
		});
	}
	if (!mail) {
		error(404, {
			code: 'SV005',
			message: 'Mail not found',
		});
	}

	const { html, ...rest } = mail;

	const form = await update.load(locals.language, subscriber);

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
		form,
	};
};

export const actions: Actions = {
	update: update.action,
};
