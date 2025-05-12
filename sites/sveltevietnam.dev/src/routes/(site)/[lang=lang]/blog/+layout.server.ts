import * as subscribe from '$lib/forms/subscribe/server';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		subscribeFormData: await subscribe.load(locals.language, 'blog'),
	};
};
