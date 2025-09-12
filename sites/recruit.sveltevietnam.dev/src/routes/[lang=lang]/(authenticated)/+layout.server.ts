import { redirect } from '@sveltejs/kit';

import * as p from '$data/routes/generated';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, params, url }) => {
	const { lang } = params;
	if (!locals.user) redirect(302, p['/:lang/authenticate']({ lang }) + `?callback=${url.pathname}`);
};
