import { redirect } from '@sveltejs/kit';

import * as p from '$data/routes/generated';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, request, locals }) => {
	const { lang } = params;
	await locals.auth.api.signOut({
		headers: request.headers,
		request: request,
	});
	redirect(302, p['/:lang/authenticate']({ lang }));
};
