import { POST } from '$data/mocks';
import { getPageFromUrl } from '$lib/utils/url';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const total = 10;
	return {
		posts: new Array(10).fill(POST),
		page: getPageFromUrl(url, total),
		total,
	};
};
