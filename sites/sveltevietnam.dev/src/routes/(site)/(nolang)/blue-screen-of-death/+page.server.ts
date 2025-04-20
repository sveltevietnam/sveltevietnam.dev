import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		routing: null,
		meta: {
			title: 'Blue Screen of Death | Svelte Vietnam',
			description: 'Hey look, something familiar!',
		},
	};
};
