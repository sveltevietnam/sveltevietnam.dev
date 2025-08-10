import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	return {
		routing: {
			breadcrumbs: b['/:lang/login']({ lang }),
			paths: {
				vi: p['/:lang/login']({ lang: 'vi' }),
				en: p['/:lang/login']({ lang: 'en' }),
			},
		},
	};
};
