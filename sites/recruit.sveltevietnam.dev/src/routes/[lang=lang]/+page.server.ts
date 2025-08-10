import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		routing: {
			paths: {
				en: '/en',
				vi: '/vi',
			},
		},
	};
};
