import * as p from '$data/routes/generated';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { url, params } = event;
	const token = url.searchParams.get('token');
	return {
		routing: {
			paths: {
				vi: p['/:lang/mails/:id']({ lang: 'vi', id: params.id }) + `?token=${token}`,
				en: p['/:lang/mails/:id']({ lang: 'en', id: params.id }) + `?token=${token}`,
			},
		},
	};
};
