import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const { lang } = params;
	return {
		routing: {
			breadcrumbs: b['/:lang/postings/create']({ lang }),
			paths: {
				vi: p['/:lang/postings/create']({ lang: 'vi' }),
				en: p['/:lang/postings/create']({ lang: 'en' }),
			},
		},
	};
};
