import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	redirect(303, `/${locals.language}`);
};
