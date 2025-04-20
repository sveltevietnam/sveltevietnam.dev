import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-search.en.jpg?url';
import ogImageVi from './_page/og-search.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;

	return {
		routing: {
			breadcrumbs: b['/:lang/search']({ lang }),
			paths: {
				vi: p['/:lang/search']({ lang: 'vi' }),
				en: p['/:lang/search']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.search.title'](lang),
			description: m['pages.search.desc'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
