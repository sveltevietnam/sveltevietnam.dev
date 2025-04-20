import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-settings.en.jpg?url';
import ogImageVi from './_page/og-settings.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;

	return {
		routing: {
			breadcrumbs: b['/:lang/sponsor']({ lang }),
			paths: {
				vi: p['/:lang/sponsor']({ lang: 'vi' }),
				en: p['/:lang/sponsor']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.settings.title'](lang),
			description: m['pages.settings.desc'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
