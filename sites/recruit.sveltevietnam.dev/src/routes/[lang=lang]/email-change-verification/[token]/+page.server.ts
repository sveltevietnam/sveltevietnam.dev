import { redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';

import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, request }) => {
	const { token, lang } = params;
	if (!token) redirect(302, p['/:lang/authenticate']({ lang }));

	let status: 'ok' | 'expired' | 'invalid' | 'unknown' = 'ok';
	try {
		await locals.auth.api.verifyEmail({
			query: { token },
			headers: request.headers,
			request,
		});
	} catch (e) {
		if (e instanceof APIError) {
			if (e.message === 'token_expired') {
				status = 'expired';
			} else if (e.message === 'invalid_token') {
				status = 'invalid';
			} else {
				status = 'unknown';
				// TODO: error logging
			}
		}
	}

	return {
		status,
		routing: {
			paths: {
				vi: p['/:lang/email-change-verification/:token']({ lang: 'vi', token }),
				en: p['/:lang/email-change-verification/:token']({ lang: 'en', token }),
			},
		},
		meta: {
			title: m['pages.email_change_verification.meta.title'](lang).toString(),
		},
	};
};
