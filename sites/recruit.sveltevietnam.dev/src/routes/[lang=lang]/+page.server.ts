import { redirect } from '@sveltejs/kit';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, locals }) => {
	if (locals.user) redirect(302, p['/:lang/postings']({ lang: params.lang }));

	const { lang } = params;
	return {
		routing: {
			breadcrumbs: b['/:lang']({ lang }),
			paths: {
				vi: p['/:lang']({ lang: 'vi' }),
				en: p['/:lang']({ lang: 'en' }),
			},
		},
	};
};
