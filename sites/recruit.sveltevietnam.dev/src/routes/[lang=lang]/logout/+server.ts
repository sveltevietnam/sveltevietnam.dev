import { redirect } from '@sveltejs/kit';

import * as p from '$data/routes/generated';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { lang } = params;
	// TODO: perform logout logic here
	redirect(302, p['/:lang/login']({ lang }));
};
