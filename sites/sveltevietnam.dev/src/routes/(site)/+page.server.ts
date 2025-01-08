import { POST } from '$data/mocks';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		posts: new Array(3).fill(POST),
	};
};
