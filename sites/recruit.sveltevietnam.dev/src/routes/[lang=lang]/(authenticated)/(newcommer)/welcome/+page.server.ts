import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import * as m from '$lib/i18n/generated/messages';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const { lang } = params;
	return {
		routing: {
			breadcrumbs: b['/:lang/welcome']({ lang }),
			paths: {
				vi: p['/:lang/welcome']({ lang: 'vi' }),
				en: p['/:lang/welcome']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.welcome.meta.title'](lang),
		},
	};
};
