import { SVELTE_VIETNAM_BLOG } from '$data/structured';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const data = await parent();
	return {
		...data,
		meta: {
			...data.meta,
			structured: SVELTE_VIETNAM_BLOG,
		},
	};
};
