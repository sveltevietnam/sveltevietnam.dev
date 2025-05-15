import { upsert } from '$lib/forms/subscriber/server';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		subscribeFormData: await upsert.load(locals.language, 'blog'),
	};
};
