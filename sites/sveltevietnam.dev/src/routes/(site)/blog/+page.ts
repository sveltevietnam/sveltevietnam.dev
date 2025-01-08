import { SVELTE_VIETNAM_BLOG } from '$data/structured';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
	const parentLoadData = await parent();
	return {
		...data,
		meta: {
			...parentLoadData.meta,
			structured: SVELTE_VIETNAM_BLOG,
		},
	};
};
