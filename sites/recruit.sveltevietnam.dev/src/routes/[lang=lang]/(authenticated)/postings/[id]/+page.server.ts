import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const { lang, id } = params;
	return {
		routing: {
			breadcrumbs: b['/:lang/postings/:id']({ lang, id: [id, 'TODO'] }),
			paths: {
				vi: p['/:lang/postings/:id']({ lang: 'vi', id }),
				en: p['/:lang/postings/:id']({ lang: 'en', id }),
			},
		},
	};
};
