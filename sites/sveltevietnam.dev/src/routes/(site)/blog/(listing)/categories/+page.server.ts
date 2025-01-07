import { CATEGORIES } from '$data/mocks';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		categories: CATEGORIES,
	};
};
