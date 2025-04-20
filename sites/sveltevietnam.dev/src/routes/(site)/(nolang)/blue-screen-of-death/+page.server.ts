import * as p from '$data/routes/generated';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		routing: {
			breadcrumbs: [],
			paths: {
				en: p['/blue-screen-of-death']('en'),
				vi: p['/blue-screen-of-death']('vi'),
			},
		},
		meta: {
			title: 'Blue Screen of Death | Svelte Vietnam',
			description: 'Hey look, something familiar!',
		},
	};
};
