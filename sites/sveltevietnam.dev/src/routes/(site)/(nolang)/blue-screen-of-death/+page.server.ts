import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		meta: {
			title: 'Blue Screen of Death | Svelte Vietnam',
			description: 'Hey look, something familiar!',
		},
	};
};
