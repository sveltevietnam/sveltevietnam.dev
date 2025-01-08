import { POST } from '$data/mocks';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		posts: {
			latest: new Array(3).fill(POST),
			technical: new Array(4).fill(POST),
			insider: new Array(3).fill(POST),
		},
	};
};
