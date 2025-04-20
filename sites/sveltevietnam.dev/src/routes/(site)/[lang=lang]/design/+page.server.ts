import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-design.en.jpg?url';
import ogImageVi from './_page/og-design.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;

	return {
		routing: {
			breadcrumbs: b['/:lang/design']({ lang }),
			paths: {
				vi: p['/:lang/design']({ lang: 'vi' }),
				en: p['/:lang/design']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.design.title'](lang),
			description: m['pages.design.desc'](lang),
			keywords: m['pages.design.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
